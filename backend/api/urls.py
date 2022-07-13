from django.urls import path, include

from .views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'csv', CsvViewset)

router.register(r'model_1_args', Model1ArgsViewset)
router.register(r'model_1', Model1Viewset)

router.register(r'model_2_args', Model2ArgsViewset)
router.register(r'model_2', Model2Viewset)

router.register(r'model_3_args', Model3ArgsViewset)
router.register(r'model_3', Model3Viewset)

router.register(r'model_4_args', Model4ArgsViewset)
router.register(r'model_4', Model4Viewset)

router.register(r'model_5_args', Model5ArgsViewset)
router.register(r'model_5', Model5Viewset)

router.register(r'model_6_args', Model6ArgsViewset)
router.register(r'model_6', Model6Viewset)

router.register(r'model_7_args', Model7ArgsViewset)
router.register(r'model_7', Model7Viewset)

router.register(r'model_8_args', Model8ArgsViewset)
router.register(r'model_8', Model8Viewset)

router.register(r'model_9_args', Model9ArgsViewset)
router.register(r'model_9', Model9Viewset)

router.register(r'model_10_args', Model10ArgsViewset)
router.register(r'model_10', Model10Viewset)

urlpatterns = [
    path('', include(router.urls)),
]