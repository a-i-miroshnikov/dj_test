from django.db import models
import numpy as np
import pandas as pd
from scipy import integrate
import math
from tqdm import tqdm
import simplejson as json

def get_tech_value(tech_name, tech_path, average=False):
    """
    Возвращаем значение требуемой технологии (Берем первую строчку).
    Среднее значение высчитывает на основе всего столбца.
    """
    tech_data_df = pd.read_csv(tech_path, sep=';', decimal=',', header=None)
    for i in tech_data_df.columns:
        if tech_data_df[i][0] == tech_name:
            if average:
                return np.mean(tech_data_df[i][1:].to_numpy(dtype=np.float64))
            return float(tech_data_df[i][1].replace(',', '.'))
    raise Exception(f'Колонка "{tech_name}" не найдена!')

def json_clear(info):
    if isinstance(info, str):
        return json.loads(info)
    return info

class CsvData(models.Model):
    tech_data = models.FileField(upload_to='csv_files')
    strip = models.FileField(upload_to='csv_files')
    swath = models.FileField(upload_to='csv_files')

    def delete(self, using=None, keep_parents=False):
        self.tech_data.storage.delete(self.tech_data.name)
        self.strip.storage.delete(self.strip.name)
        self.swath.storage.delete(self.swath.name)
        super().delete()

class Model1Args(models.Model):
    x = models.FloatField()
    w = models.FloatField()
    xi_p = models.FloatField()
    xi_c = models.FloatField()
    xi_m = models.FloatField()
    z_0 = models.FloatField()
    z_p = models.FloatField()
    z_c = models.FloatField()
    z_m = models.FloatField()
    z_e = models.FloatField()
    W12_average = models.BooleanField(default = False)

class Model1(models.Model):
    """
    1. Распределение контактного давления валков
    """

    args = models.ForeignKey(Model1Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    Apl_res = models.TextField(blank=True) # №1
    Bpl = models.TextField(blank=True) # №2
    v_res = models.TextField(blank=True) # №3
    f_c_res = models.FloatField(blank=True) # №4
    f_e_res = models.FloatField(blank=True)  # №5
    Kxl_res = models.FloatField(blank=True)  # №6
    Kx_res = models.FloatField(blank=True)  # №7
    W_c = models.FloatField(blank=True)
    little_w_c = models.FloatField(blank=True)
    K_pnorm = models.FloatField(blank=True) # №8
    K_px_res = models.FloatField(blank=True) # №9
    result = models.FloatField(blank=True)

    @property
    def x(self):
        return self.args.x

    @property
    def w(self):
        return self.args.w

    @property
    def xi_p(self):
        return self.args.xi_p

    @property
    def xi_c(self):
        return self.args.xi_c

    @property
    def xi_m(self):
        return self.args.xi_m

    @property
    def z_0(self):
        return self.args.z_0

    @property
    def z_p(self):
        return self.args.z_p

    @property
    def z_c(self):
        return self.args.z_c

    @property
    def z_m(self):
        return self.args.z_m

    @property
    def z_e(self):
        return self.args.z_e

    @property
    def W12_average(self):
        return self.args.W12_average

    @property
    def W12(self):
        return get_tech_value('W12', self.csv.tech_data.path, self.W12_average)

    def save(self, *args, **kwargs):

        # №2
        self.Bpl = [self.z_0, self.z_p, self.z_c, self.z_c, self.z_m, self.z_e, 0]

        # №8
        self.W_c = self.W12 * 10 ** -3
        self.little_w_c = 0.5 * self.W_c
        self.K_pnorm = (1 / self.W_c) * integrate.quad(lambda xi: self.Kx(xi, self.little_w_c), -self.little_w_c, self.little_w_c)[0]

        # №9
        self.K_px_res = self.K_px(self.x, self.w)
        self.result = self.K_px_res

        # Форматирование для БД
        self.Apl_res = json.dumps(self.Apl_res) # №1
        self.Bpl = json.dumps(self.Bpl) # №2
        self.v_res = json.dumps(self.v_res.tolist()) # №3

        super().save(*args, **kwargs)

    # №1
    def Apl(self, w):
        self.Apl_res = [
            [1, 0, 0, 0, 0, 0, 0],
            [1, np.power((w - self.xi_p), 2), np.power((w - self.xi_p), 6), 0, 0, 0, 0],
            [1, np.power((w - self.xi_c), 2), np.power((w - self.xi_c), 6), 0, 0, 0, 0],
            [0, 0, 0, 1, (w - self.xi_c), np.power((w - self.xi_c), 2), np.power((w - self.xi_c), 3)],
            [0, 0, 0, 1, (w - self.xi_m), np.power((w - self.xi_m), 2), np.power((w - self.xi_m), 3)],
            [0, 0, 0, 1, w, np.power(w, 2), np.power(w, 3)],
            [0, 2 * (w - self.xi_c), 6 * np.power((w - self.xi_c), 5), 0, -1, -2 * (w - self.xi_c),
             -3 * np.power((w - self.xi_c), 2)]
        ]
        return self.Apl_res

    # №3
    def v(self, w):
        self.v_res = np.matmul(np.linalg.inv(self.Apl(w)), json_clear(self.Bpl))
        return self.v_res

    # №4
    def f_c(self, x, w):
        self.f_c_res = self.v(w)[0] + self.v(w)[1] * np.power(x, 2) + self.v(w)[2] * np.power(x, 6)
        return self.f_c_res

    # №5
    def f_e(self, x, w):
        self.f_e_res = self.v(w)[3] + self.v(w)[4] * x + self.v(w)[5] * np.power(x, 2) + self.v(w)[6] * np.power(x, 3)
        return self.f_e_res

    # №6
    def Kxl(self, x, w):
        if 0 <= x <= (w - self.xi_c):
            self.Kxl_res = self.f_c(x, w)
            return self.Kxl_res
        elif (w - self.xi_c) <= x <= w:
            self.Kxl_res = self.f_e(x, w)
            return self.Kxl_res
        self.Kxl_res = 0
        return self.Kxl_res

    # №7
    def Kx(self, x, w):
        self.Kx_res = self.Kxl(x, w) if 0 <= x else self.Kxl(-x, w)
        return self.Kx_res

    # №9
    def K_px(self, x, w):
        return self.Kx(x, w) / self.K_pnorm

class Model2Args(models.Model):
    S_x = models.FloatField()
    L_bu = models.FloatField()
    L_conic = models.FloatField()
    Yu = models.FloatField()
    mu = models.FloatField()
    D_bu = models.FloatField()
    L_ck = models.FloatField()
    W12_average = models.BooleanField(default = False)
    P12_average = models.BooleanField(default = False)

class Model2(models.Model):
    """
    2. Профиль валков (по Целикову) изгиб валков
    """

    args = models.ForeignKey(Model2Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    aHC = models.FloatField(blank = True)
    Ge = models.FloatField(blank = True)
    W_c = models.FloatField(blank = True)
    P_c = models.FloatField(blank = True)
    MpW = models.FloatField(blank = True)
    N_b = models.IntegerField(blank = True)
    yBUd_j = models.TextField(blank = True)
    result = models.TextField(blank=True)

    @property
    def S_x(self):
        return self.args.S_x

    @property
    def L_bu(self):
        return self.args.L_bu

    @property
    def L_conic(self):
        return self.args.L_conic

    @property
    def Yu(self):
        return self.args.Yu

    @property
    def mu(self):
        return self.args.mu

    @property
    def D_bu(self):
        return self.args.D_bu

    @property
    def L_ck(self):
        return self.args.L_ck

    @property
    def W12_average(self):
        return self.args.W12_average

    @property
    def W12(self):
        return get_tech_value('W12', self.csv.tech_data.path, self.W12_average)

    @property
    def P12_average(self):
        return self.args.P12_average

    @property
    def P12(self):
        return get_tech_value('P12', self.csv.tech_data.path, self.P12_average)

    def save(self, *args, **kwargs):

        # №1
        self.aHC = self.L_bu + self.L_conic

        # №2
        self.Ge = self.Yu / (2 * (1 + self.mu))

        self.W_c = self.W12 * 10 ** -3

        self.P_c = self.P12 * 10 ** -4

        # №6
        self.MpW = self.P_c / self.YbuW(self.P_c)

        self.N_b = round(self.L_bu / (2 * self.S_x))

        # №8
        self.yBUd_j = [self.yBU(j * self.S_x) * 10 ** 6 for j in range(self.N_b)]

        # Форматирование для БД
        self.yBUd_j = json.dumps(self.yBUd_j)

        self.result = self.yBUd_j

        super().save(*args, **kwargs)

    # №3
    def Ybu1W(self, P):
        return P * self.W_c ** 2 / (18.8 * self.Yu * self.D_bu ** 4) * \
               (12 * self.aHC - 8 * self.W_c - 6 * self.L_ck - self.W_c ** 12 / self.L_ck)

    # №4
    def Ybu2W(self, P):
        return P * self.W_c / (self.Ge * 3.14 * self.D_bu ** 2) * \
               (1 - self.W_c / (2 * self.L_ck))

    # №5
    def YbuW(self, P):
        return 2 * (self.Ybu1W(P) + self.Ybu2W(P))

    # №7
    def yBU(self, z):
        return self.YbuW(self.P_c) * (2 * z / self.W_c) ** 2

class Model3Args(models.Model):
    b1 = models.FloatField()
    b2 = models.FloatField()
    b3 = models.FloatField()
    z = models.FloatField()
    sh = models.FloatField()

class Model3(models.Model):
    """
    3. Смещение валков от (оси полосы или начального положения)
    """

    args = models.ForeignKey(Model3Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    uGc0 = models.FloatField(blank = True)
    result = models.FloatField(blank=True)

    @property
    def b1(self):
        return self.args.b1

    @property
    def b2(self):
        return self.args.b2

    @property
    def b3(self):
        return self.args.b3

    @property
    def z(self):
        return self.args.z

    @property
    def sh(self):
        return self.args.sh

    def save(self, *args, **kwargs):

        # №3
        self.uGc0 = self.uTc(self.z + self.sh) + self.uBc(self.z - self.sh)

        self.result = self.uGc0

        super().save(*args, **kwargs)

    # №1
    def uTc(self, z):
        return self.b1 * z + self.b2 * z ** 2 + self.b3 * z ** 3

    # №2
    def uBc(self, z):
        return self.b1 * z + self.b2 * z ** 2 + self.b3 * z ** 3

class Model4Args(models.Model):
    L_wr = models.FloatField()
    S_x = models.FloatField()
    Sh12_average = models.BooleanField(default = False)

class Model4(models.Model):
    """
    4. Зазор (исходный)
    """

    args = models.ForeignKey(Model4Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    l_w = models.FloatField(blank = True)
    S_hc = models.FloatField(blank = True)
    Cr0 = models.FloatField(blank = True)
    N_wr = models.IntegerField(blank = True)
    yGd = models.TextField(blank = True)
    result = models.TextField(blank=True)

    @property
    def swath_df(self):
        return pd.read_csv(self.csv.swath.path, sep=';', decimal=',', header=None)

    @property
    def L_wr(self):
        return self.args.L_wr

    @property
    def S_x(self):
        return self.args.S_x

    @property
    def Sh12_average(self):
        return self.args.Sh12_average

    @property
    def Sh12(self):
        return get_tech_value('Sh12', self.csv.tech_data.path, self.Sh12_average)

    @property
    def pT0(self):
        return self.swath_df[1]

    @property
    def pT1(self):
        return self.swath_df[2]

    @property
    def pB0(self):
        return self.swath_df[3]

    @property
    def pB1(self):
        return self.swath_df[4]

    @property
    def xx(self):
        return self.swath_df[0]

    def save(self, *args, **kwargs):

        self.l_w = self.L_wr / 2

        # №10
        self.S_hc = self.Sh12 * 10 ** -3
        self.Cr0 = self.Cr(self.S_hc)

        # №12
        self.N_wr = round(self.L_wr / (2 * self.S_x))
        self.yGd = self.yGd_j()

        # Форматирование для БД
        self.yGd = json.dumps(self.yGd)

        self.result = self.yGd

        super().save(*args, **kwargs)

    # №1
    def pTg1(self, x):
        return np.interp(x, self.xx, self.pT0)

    # №2
    def pTw1(self, x):
        return np.interp(x, self.xx, self.pT1)

    # №3
    def pBg(self, x):
        return np.interp(x, self.xx, self.pB0)

    # №4
    def pBw(self, x):
        return np.interp(x, self.xx, self.pB1)

    # №5
    def pTg(self, z):
        return self.pTg1(self.L_wr - z)

    # №6
    def pTw(self, z):
        return self.pTw1(self.L_wr - z)

    # №7
    def uGg0(self, z, sh):
        return self.pTg(z - sh) - self.pBg(z + sh)

    # №8
    def uGg(self, z, sh):
        return self.uGg0(z, sh) - self.uGg0(0, sh)

    # №9
    def Cr(self, sh):
        return self.uGg(self.l_w, sh)

    # №11
    def yG(self, z):
        return self.Cr0 * (1 - (z / (self.l_w - self.S_hc)) ** 2)

    # №12
    def yGd_j(self):
        return [self.yG(j * self.S_x) * 10 ** 3 for j in range(self.N_wr + 1)]

class Model5Args(models.Model):
    x = models.FloatField()
    sh = models.FloatField()
    model4 = models.ForeignKey(Model4, on_delete=models.SET_NULL, null=True)
    W12_average = models.BooleanField(default=False)
    S_x = models.FloatField()

class Model5(models.Model):
    """
    5. Износ профиля валков
    """

    args = models.ForeignKey(Model5Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    W_c = models.FloatField(blank = True)
    N_w = models.IntegerField(blank = True)
    delta_yG = models.FloatField(blank = True)
    result = models.FloatField(blank = True)

    @property
    def x(self):
        return self.args.x

    @property
    def sh(self):
        return self.args.sh

    @property
    def W12_average(self):
        return self.args.W12_average

    @property
    def W12(self):
        return get_tech_value('W12', self.csv.tech_data.path, self.W12_average)

    @property
    def S_x(self):
        return self.args.S_x

    @property
    def model4(self):
        return self.args.model4

    def save(self, *args, **kwargs):

        # №2
        self.W_c = self.W12 * 10 ** -3
        self.N_w = round(self.W_c / (2 * self.S_x))
        self.delta_yG = self.model4.yGd_j()[0] - self.model4.yGd_j()[self.N_w]

        self.result = self.delta_yG

        super().save(*args, **kwargs)

    # №1
    def uGw(self, x, sh):
        return self.model4.pTw(x - sh) - self.model4.pBw(x + sh)

class Model6Args(models.Model):
    L_wr = models.FloatField()
    z = models.FloatField()
    model4 = models.ForeignKey(Model4, on_delete=models.SET_NULL, null=True)

class Model6(models.Model):
    """
    6. Износ + зазоры
    """

    args = models.ForeignKey(Model6Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    result = models.FloatField(blank = True)

    @property
    def L_wr(self):
        return self.args.L_wr

    @property
    def z(self):
        return self.args.z

    @property
    def model4(self):
        return self.args.model4

    def save(self, *args, **kwargs):

        self.result = self.wG(self.z)

        super().save(*args, **kwargs)

    # №1
    def wT1(self, z):
        return self.model4.pTg(z) - self.model4.pTw(z)

    # №2
    def wT(self, z):
        return self.wT1(z) - min(self.wT1(0), self.wT1(self.L_wr))

    # №3
    def wB1(self, z):
        return self.model4.pBg(z) - self.model4.pBw(z)

    # №4
    def wB(self, z):
        return self.wB1(z) - min(self.wB1(0), self.wB1(self.L_wr))

    # №5
    def wG1(self, x):
        return self.wT(x) + self.wB(x)

    # №6
    def wG(self, z):
        return self.wG1(z) - min(self.wG1(0), self.wG1(self.L_wr))

class Model7Args(models.Model):
    M_x = models.FloatField()
    T_sc = models.FloatField()
    T_se = models.FloatField()
    T_re = models.FloatField()
    T_cool = models.FloatField()
    L_wr = models.FloatField()
    S_x = models.FloatField()
    K_expan = models.FloatField()
    W12_average = models.BooleanField(default=False)
    D12bot_average = models.BooleanField(default=False)
    D12top_average = models.BooleanField(default=False)

class Model7(models.Model):
    """
    7. Модель распределения температур в валке
    """

    args = models.ForeignKey(Model7Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    W_c = models.FloatField(blank = True)
    little_w_c = models.FloatField(blank = True)
    K_c = models.FloatField(blank = True)
    l_w = models.FloatField(blank = True)
    K_e = models.FloatField(blank = True)
    R_w0 = models.FloatField(blank = True)
    N_wr = models.IntegerField(blank = True)
    Tzz_j = models.TextField(blank = True)
    Tza_j = models.TextField(blank = True)
    Tsud_j = models.TextField(blank = True)
    W_c = models.FloatField(blank = True)
    N_w = models.IntegerField(blank = True)
    delta_Tws = models.FloatField(blank = True)
    delta_Dtd_j = models.TextField(blank = True)
    delta_DtW = models.FloatField(blank = True)
    result = models.FloatField(blank = True)

    @property
    def M_x(self):
        return self.args.M_x

    @property
    def T_sc(self):
        return self.args.T_sc

    @property
    def T_se(self):
        return self.args.T_se

    @property
    def T_re(self):
        return self.args.T_re

    @property
    def T_cool(self):
        return self.args.T_cool

    @property
    def L_wr(self):
        return self.args.L_wr

    @property
    def S_x(self):
        return self.args.S_x

    @property
    def K_expan(self):
        return self.args.K_expan

    @property
    def W12_average(self):
        return self.args.W12_average

    @property
    def W12(self):
        return get_tech_value('W12', self.csv.tech_data.path, self.W12_average)

    @property
    def D12bot_average(self):
        return self.args.D12bot_average

    @property
    def D12bot(self):
        return get_tech_value('D12bot', self.csv.tech_data.path, self.D12bot_average)

    @property
    def D12top_average(self):
        return self.args.D12top_average

    @property
    def D12top(self):
        return get_tech_value('D12top', self.csv.tech_data.path, self.D12top_average)

    def save(self, *args, **kwargs):

        # №1
        self.W_c = self.W12 * 10 ** -3
        self.little_w_c = 0.5 * self.W_c
        self.K_c = (self.T_sc - self.T_se) / (1 - math.exp(self.little_w_c * self.M_x))

        # №3
        self.l_w = 0.5 * self.L_wr
        self.K_e = (self.T_se - self.T_re) / (1 - math.exp(-self.M_x * (self.l_w - self.little_w_c)))

        # №8
        self.R_w0 = 0.25 * (self.D12top + self.D12bot) * 10 ** -3

        # №11
        self.N_wr = round(self.L_wr / (2 * self.S_x))
        self.Tzz_j = [self.Tz(j * self.S_x + self.L_wr / 2) for j in tqdm(range(self.N_wr + 1))]

        # №12
        self.Tza_j = [self.Tzz_j[j] + self.T_cool for j in range(self.N_wr + 1)]

        # №13
        self.Tsud_j = [self.Tsurf(j * self.S_x + (self.L_wr / 2)) + self.T_cool for j in range(self.N_wr + 1)]

        # №14
        self.W_c = self.W12 * 10 ** -3
        self.N_w = round(self.W_c / (2 * self.S_x))
        self.delta_Tws = self.Tza_j[0] - self.Tza_j[self.N_w]

        # №15
        self.delta_Dtd_j = [2 * self.R_w0 * self.K_expan * 10 ** 6 * j for j in self.Tzz_j]

        # №16
        self.delta_DtW = self.delta_Dtd_j[0] - self.delta_Dtd_j[self.N_w]

        # Форматирование для БД
        self.Tzz_j = json.dumps(self.Tzz_j)
        self.Tza_j = json.dumps(self.Tza_j)
        self.Tsud_j = json.dumps(self.Tsud_j)
        self.delta_Dtd_j = json.dumps(self.delta_Dtd_j)

        self.result = self.delta_DtW

        super().save(*args, **kwargs)

    # №2
    def uc(self, x):
        return self.T_se + self.K_c * (1 - math.exp(self.M_x * (x - self.little_w_c)))

    # №4
    def ue(self, x):
        return self.T_se - self.K_e * (1 - math.exp(self.M_x * (-x + self.little_w_c)))

    # №5
    def Tsu(self, x):
        if 0 <= x <= self.little_w_c:
            return self.uc(x)
        if self.little_w_c <= x <= self.l_w:
            return self.ue(x)
        return 0

    # №6
    def Tsu1(self, x):
        if 0 <= x <= self.l_w:
            return self.Tsu(x)
        if x <= 0:
            return self.Tsu(-x)
        return 0

    # №7
    def Tsurf(self, x):
        return self.Tsu1(x - self.l_w) - self.T_cool

    # №9
    def Trz(self, r, z):
        def integrand(zz, n):
            return self.Tsurf(zz) * np.sin((n * np.pi * zz) / self.L_wr)

        summa = 0
        for n in range(1, 37):
            summa += (r / self.R_w0) * np.sin((n * np.pi * z) / self.L_wr) * \
                     integrate.quad(integrand, 0, self.L_wr, args=(n))[0]
        return (2 / self.L_wr) * summa

    # №10
    def Tz(self, z):
        def integrand(r, z):
            return self.Trz(r, z)

        return (1 / self.R_w0) * integrate.quad(integrand, 0, self.R_w0, args=(z))[0]

class Model8Args(models.Model):
    Yu = models.FloatField()
    mu = models.FloatField()
    Ce = models.FloatField()
    S_x = models.FloatField()
    H12_average = models.BooleanField(default=False)
    W12_average = models.BooleanField(default=False)
    V11_average = models.BooleanField(default=False)
    V12_average = models.BooleanField(default=False)
    P12_average = models.BooleanField(default=False)
    D12bot_average = models.BooleanField(default=False)
    D12top_average = models.BooleanField(default=False)
    model2 = models.ForeignKey(Model2, on_delete=models.SET_NULL, null=True)
    model7 = models.ForeignKey(Model7, on_delete=models.SET_NULL, null=True)
    model1 = models.ForeignKey(Model1, on_delete=models.SET_NULL, null=True)

class Model8(models.Model):
    """
    8. Растяжение (деформация) в валках
    """

    args = models.ForeignKey(Model8Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    Lambda = models.FloatField(blank = True)
    Coef = models.FloatField(blank = True)
    theta = models.FloatField(blank = True)
    h_1 = models.FloatField(blank = True)
    delta_h = models.FloatField(blank = True)
    P_c = models.FloatField(blank = True)
    W_c = models.FloatField(blank = True)
    R_c = models.FloatField(blank = True)
    Lgap = models.FloatField(blank = True)
    q_m = models.FloatField(blank = True)
    xA = models.FloatField(blank = True)
    N_w = models.IntegerField(blank = True)
    y_i = models.TextField(blank = True)
    little_w_c = models.FloatField(blank = True)
    J_i = models.TextField(blank = True)
    delta_Df_i = models.TextField(blank = True)
    Mrs_i = models.TextField(blank = True)
    result = models.TextField(blank = True)

    @property
    def Yu(self):
        return self.args.Yu

    @property
    def mu(self):
        return self.args.mu

    @property
    def Ce(self):
        return self.args.Ce

    @property
    def S_x(self):
        return self.args.S_x

    @property
    def H12_average(self):
        return self.args.H12_average

    @property
    def H12(self):
        return get_tech_value('H12', self.csv.tech_data.path, self.H12_average)

    @property
    def W12_average(self):
        return self.args.W12_average

    @property
    def W12(self):
        return get_tech_value('W12', self.csv.tech_data.path, self.W12_average)

    @property
    def V11_average(self):
        return self.args.V11_average

    @property
    def V11(self):
        return get_tech_value('V11', self.csv.tech_data.path, self.V11_average)

    @property
    def V12_average(self):
        return self.args.V12_average

    @property
    def V12(self):
        return get_tech_value('V12', self.csv.tech_data.path, self.V12_average)

    @property
    def P12_average(self):
        return self.args.P12_average

    @property
    def P12(self):
        return get_tech_value('P12', self.csv.tech_data.path, self.P12_average)

    @property
    def D12bot_average(self):
        return self.args.D12bot_average

    @property
    def D12bot(self):
        return get_tech_value('D12bot', self.csv.tech_data.path, self.D12bot_average)

    @property
    def D12top_average(self):
        return self.args.D12top_average

    @property
    def D12top(self):
        return get_tech_value('D12top', self.csv.tech_data.path, self.D12top_average)

    @property
    def model2(self):
        return self.args.model2

    @property
    def model7(self):
        return self.args.model7

    @property
    def model1(self):
        return self.args.model1

    def save(self, *args, **kwargs):

        # №1
        self.Lambda = (self.mu * self.Yu) / ((1 + self.mu) * (1 - 2 * self.mu))

        # №2
        self.Coef = (self.Lambda + 2 * self.model2.Ge) / (4 * np.pi * self.model2.Ge * (self.Lambda + self.model2.Ge))

        # №3
        self.theta = (1 - self.mu ** 2) / (np.pi * self.Yu)

        # №4
        self.h_1 = self.H12 * 10 ** -3
        self.delta_h = self.h_1 * (self.V12 / self.V11) - self.h_1

        # №6
        self.P_c = self.P12 * 10 ** -4
        self.W_c = self.W12 * 10 ** -3
        self.R_c = self.R_d(self.P_c, self.delta_h, self.W_c)

        # №7
        self.Lgap = np.sqrt(self.R_c * self.delta_h)

        # №8
        self.q_m = self.P_c / (self.W_c * self.Lgap)

        # №10
        self.xA = 0.01 * self.Lgap

        # №11
        self.N_w = round(self.W_c / (2 * self.S_x))
        self.y_i = [i * self.S_x for i in range(self.N_w + 1)]

        # №12
        self.little_w_c = 0.5 * self.W_c
        self.J_i = []
        for i in tqdm(range(len(self.y_i))):
            self.i = i
            self.J_i.append(integrate.dblquad(
                lambda v, xi: (1.5 * (1 - ((2 * xi) / self.Lgap) ** 2) * self.q_m * self.model1.result) /
                              # Должно быть self.model1.K_px(v, self.little_w_c) вместо self.model1.result
                              np.sqrt((self.xA - xi) ** 2 + (self.y_i[self.i] - v) ** 2),
                -0.5 * self.Lgap, 0.5 * self.Lgap, lambda xi: -self.little_w_c, lambda xi: self.little_w_c)[0])

        # №13
        self.delta_Df_i = [2 * i * self.Coef * 10 ** 6 for i in self.J_i]

        # №14
        self.Mrs_i = [(self.qq(i * self.S_x) * self.Lgap) / self.delta_Df_i[i] for i in range(len(self.J_i))]

        # Форматирование для БД
        self.y_i = json.dumps(self.y_i)
        self.J_i = json.dumps(self.J_i)
        self.delta_Df_i = json.dumps(self.delta_Df_i)
        self.Mrs_i = json.dumps(self.Mrs_i)

        self.result = self.Mrs_i

        super().save(*args, **kwargs)

    # №5
    def R_d(self, p, delta_h, w):
        return self.model7.R_w0 * (1 + (self.Ce * self.theta * p) / (delta_h * w))

    # №9
    def qq(self, x):
        return self.q_m * self.model1.K_px(x, self.W_c)

class Model9Args(models.Model):
    muF = models.FloatField()
    H12_average = models.BooleanField(default=False)
    V11_average = models.BooleanField(default=False)
    V12_average = models.BooleanField(default=False)
    model1 = models.ForeignKey(Model1, on_delete=models.SET_NULL, null=True)
    model8 = models.ForeignKey(Model8, on_delete=models.SET_NULL, null=True)

class Model9(models.Model):
    """
    9. Растяжение (расширение) полосы
    """

    args = models.ForeignKey(Model9Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    h_1 = models.FloatField(blank = True)
    h_0 = models.FloatField(blank = True)
    delta_B = models.FloatField(blank = True)
    W_c = models.FloatField(blank = True)
    little_w_c = models.FloatField(blank = True)
    Jw = models.FloatField(blank = True)
    delta_DEbr = models.FloatField(blank = True)
    result = models.FloatField(blank = True)

    @property
    def muF(self):
        return self.args.muF

    @property
    def H12_average(self):
        return self.args.H12_average

    @property
    def model8(self):
        return self.args.model8

    @property
    def model1(self):
        return self.args.model1

    @property
    def H12(self):
        return get_tech_value('H12', self.csv.tech_data.path, self.H12_average)

    @property
    def V11_average(self):
        return self.args.V11_average

    @property
    def V11(self):
        return get_tech_value('V11', self.csv.tech_data.path, self.V11_average)

    @property
    def V12_average(self):
        return self.args.V12_average

    @property
    def V12(self):
        return get_tech_value('V12', self.csv.tech_data.path, self.V12_average)

    def save(self, *args, **kwargs):

        # №1
        self.h_1 = self.H12 * 10 ** -3
        self.h_0 = self.h_1 * (self.V12 / self.V11)
        self.delta_B = 1.15 * (self.model8.delta_h / self.h_0) * (
                    np.sqrt(self.model8.R_c * self.model8.delta_h) - self.model8.delta_h / (2 * self.muF))

        # №2
        self.W_c = self.model8.W12 * 10 ** -3
        self.little_w_c = 0.5 * self.W_c
        self.Jw = integrate.dblquad(
            lambda v, xi: (1.5 * (1 - (2 * xi / self.model8.Lgap) ** 2) * self.model8.q_m * self.model1.K_px(v, self.little_w_c)) /
                          np.sqrt((self.model8.xA - xi) ** 2 + (self.little_w_c + self.delta_B - v) ** 2),
            -0.5 * self.model8.Lgap, 0.5 * self.model8.Lgap, lambda xi: -self.little_w_c, lambda xi: self.little_w_c)[0]

        # №3
        self.delta_DEbr = 2 * self.Jw * self.model8.Coef * 10 ** 6

        self.result = self.delta_DEbr

        super().save(*args, **kwargs)

class Model10Args(models.Model):
    S_x = models.FloatField()
    W12_average = models.BooleanField(default=False)
    model2 = models.ForeignKey(Model2, on_delete=models.SET_NULL, null=True)
    model8 = models.ForeignKey(Model8, on_delete=models.SET_NULL, null=True)
    model7 = models.ForeignKey(Model7, on_delete=models.SET_NULL, null=True)
    model4 = models.ForeignKey(Model4, on_delete=models.SET_NULL, null=True)

class Model10(models.Model):
    """
    10. Модель профиля полосы без износа валков
    """

    args = models.ForeignKey(Model10Args, on_delete=models.SET_NULL, null=True)
    csv = models.ForeignKey(CsvData, on_delete=models.SET_NULL, null=True)

    # Результаты алгоритмов
    W_c = models.FloatField(blank = True)
    N_w = models.IntegerField(blank = True)
    uBe_i = models.TextField(blank = True)
    uFl_i = models.TextField(blank = True)
    uTh_i = models.TextField(blank = True)
    uGr_i = models.TextField(blank = True)
    U_i = models.TextField(blank = True)
    Utot_i1 = models.TextField(blank = True)
    Utot_i2 = models.TextField(blank = True)
    Utot_i3 = models.TextField(blank = True)
    Utot_i4 = models.TextField(blank = True)
    U_crown = models.FloatField(blank = True)
    U_eddr = models.FloatField(blank = True)
    result = models.FloatField(blank = True)

    @property
    def S_x(self):
        return self.args.S_x

    @property
    def W12_average(self):
        return self.args.W12_average

    @property
    def W12(self):
        return get_tech_value('W12', self.csv.tech_data.path, self.W12_average)

    @property
    def model2(self):
        return self.args.model2

    @property
    def model8(self):
        return self.args.model8

    @property
    def model7(self):
        return self.args.model7

    @property
    def model4(self):
        return self.args.model4

    def save(self, *args, **kwargs):

        # №1
        self.W_c = self.W12 * 10 ** -3
        self.N_w = round(self.W_c / (2 * self.S_x))
        self.uBe_i = [-(i - json_clear(self.model2.yBUd_j)[self.N_w]) for i in json_clear(self.model2.yBUd_j)]

        # №2
        self.uFl_i = [(i - json_clear(self.model8.delta_Df_i)[self.N_w]) for i in json_clear(self.model8.delta_Df_i)]

        # №3
        self.uTh_i = [-(i - json_clear(self.model7.delta_Dtd_j)[self.N_w]) for i in json_clear(self.model7.delta_Dtd_j)]

        # №4
        self.uGr_i = [(i - json_clear(self.model4.yGd_j())[self.N_w]) for i in json_clear(self.model4.yGd_j())]

        # №5
        self.U_i = [(self.uBe_i[i] + self.uFl_i[i] + self.uTh_i[i] + self.uGr_i[i]) for i in
                    range(min(len(self.uBe_i), len(self.uFl_i), len(self.uTh_i), len(self.uGr_i)))]

        # №6
        self.Utot_i1 = self.uBe_i

        # №7
        self.Utot_i2 = self.uFl_i

        # №8
        self.Utot_i3 = self.uTh_i

        # №9
        self.Utot_i4 = self.uGr_i

        # №19
        self.U_crown = self.U_i[0] - self.U_i[self.N_w - 8]

        # №20
        self.U_eddr = self.U_i[self.N_w - 8] - self.U_i[self.N_w]

        self.result = self.U_eddr

        # Форматирование для БД
        self.uBe_i = json.dumps(self.uBe_i)
        self.uFl_i = json.dumps(self.uFl_i)
        self.uTh_i = json.dumps(self.uTh_i)
        self.uGr_i = json.dumps(self.uGr_i)
        self.U_i = json.dumps(self.U_i)
        self.Utot_i1 = json.dumps(self.Utot_i1)
        self.Utot_i2 = json.dumps(self.Utot_i2)
        self.Utot_i3 = json.dumps(self.Utot_i3)
        self.Utot_i4 = json.dumps(self.Utot_i4)

        super().save(*args, **kwargs)

    # №10
    def uBel(self, x):
        return np.interp(x, json_clear(self.model8.y_i), json_clear(self.uBe_i))

    # №11
    def uFl1(self, x):
        return np.interp(x, json_clear(self.model8.y_i), json_clear(self.uFl_i))

    # №12
    def uTh1(self, x):
        return np.interp(x, json_clear(self.model8.y_i), json_clear(self.uTh_i))

    # №13
    def uGr1(self, x):
        return np.interp(x, json_clear(self.model8.y_i), json_clear(self.uGr_i))

    # №14
    def uB(self, x):
        return self.uBel(x) + self.uBel(-x)

    # №15
    def uF(self, x):
        return self.uFl1(x) + self.uFl1(-x)

    # №16
    def uT(self, x):
        return self.uTh1(x) + self.uTh1(-x)

    # №17
    def uG(self, x):
        return self.uGr1(x) + self.uGr1(-x)

    # №18
    def Un(self, x):
        return self.uB(x) + self.uF(x) + self.uT(x) + self.uG(x)