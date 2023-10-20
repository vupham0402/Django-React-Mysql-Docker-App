from django.urls import path
from .views import *

urlpatterns = [
    # path('',views.ProductApi),
    path('analyst/', analyst_portal),
    path('limit-analyst/', limit_analyst_portal),
    path('market-basket/', market_basket),
    path('update-market-basket/', update_market_basket),
    path('delete-market-basket/', delete_market_basket),
    path('upload-file/', upload_file),
    path('vendor-suggestions/', vendor_suggestions),
    path('issue-market-basket/', issue_market_basket),
    path('get-columns/<str:table_name>/', get_columns),
    # path('edit-form/', edit_form_submission),
    # path('delete-form/', delete_form_submission),
]