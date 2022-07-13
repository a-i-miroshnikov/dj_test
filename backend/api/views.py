from rest_framework import viewsets

from .serializers import *

class CsvViewset(viewsets.ModelViewSet):
    queryset = CsvData.objects.all()
    serializer_class = CsvDataSerializer

class Model1ArgsViewset(viewsets.ModelViewSet):
    queryset = Model1Args.objects.all()
    serializer_class = Model1ArgsSerializer

class Model1Viewset(viewsets.ModelViewSet):
    queryset = Model1.objects.all()
    serializer_class = Model1Serializer

class Model2ArgsViewset(viewsets.ModelViewSet):
    queryset = Model2Args.objects.all()
    serializer_class = Model2ArgsSerializer

class Model2Viewset(viewsets.ModelViewSet):
    queryset = Model2.objects.all()
    serializer_class = Model2Serializer

class Model3ArgsViewset(viewsets.ModelViewSet):
    queryset = Model3Args.objects.all()
    serializer_class = Model3ArgsSerializer

class Model3Viewset(viewsets.ModelViewSet):
    queryset = Model3.objects.all()
    serializer_class = Model3Serializer

class Model4ArgsViewset(viewsets.ModelViewSet):
    queryset = Model4Args.objects.all()
    serializer_class = Model4ArgsSerializer

class Model4Viewset(viewsets.ModelViewSet):
    queryset = Model4.objects.all()
    serializer_class = Model4Serializer

class Model5ArgsViewset(viewsets.ModelViewSet):
    queryset = Model5Args.objects.all()
    serializer_class = Model5ArgsSerializer

class Model5Viewset(viewsets.ModelViewSet):
    queryset = Model5.objects.all()
    serializer_class = Model5Serializer

class Model6ArgsViewset(viewsets.ModelViewSet):
    queryset = Model6Args.objects.all()
    serializer_class = Model6ArgsSerializer

class Model6Viewset(viewsets.ModelViewSet):
    queryset = Model6.objects.all()
    serializer_class = Model6Serializer

class Model7ArgsViewset(viewsets.ModelViewSet):
    queryset = Model7Args.objects.all()
    serializer_class = Model7ArgsSerializer

class Model7Viewset(viewsets.ModelViewSet):
    queryset = Model7.objects.all()
    serializer_class = Model7Serializer

class Model8ArgsViewset(viewsets.ModelViewSet):
    queryset = Model8Args.objects.all()
    serializer_class = Model8ArgsSerializer

class Model8Viewset(viewsets.ModelViewSet):
    queryset = Model8.objects.all()
    serializer_class = Model8Serializer

class Model9ArgsViewset(viewsets.ModelViewSet):
    queryset = Model9Args.objects.all()
    serializer_class = Model9ArgsSerializer

class Model9Viewset(viewsets.ModelViewSet):
    queryset = Model9.objects.all()
    serializer_class = Model9Serializer

class Model10ArgsViewset(viewsets.ModelViewSet):
    queryset = Model10Args.objects.all()
    serializer_class = Model10ArgsSerializer

class Model10Viewset(viewsets.ModelViewSet):
    queryset = Model10.objects.all()
    serializer_class = Model10Serializer