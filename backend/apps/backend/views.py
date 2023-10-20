import json
import re
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.core.paginator import Paginator
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from django.db.models import Q
from django.contrib.auth.models import User
from django.core.mail import send_mail

from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


from .models import Products
# from .models import MemberForm
from .models import MarketBasketCLN
from .models import MarketBasketTemp
from apps.backend.serializer import ProductsSerializer
# from backend.serializer import MemberFormSerializer
from apps.backend.serializer import MarketBasketSerializer
from apps.backend.serializer import MarketBasketSerializerTemp


# from backend.serializer import UserSerializer

from django.db import connection
from django.conf import settings
from fuzzywuzzy import fuzz, process
from .models_mapping import TABLE_MODEL_MAPPING

## Following request is getting data from the product API 
@csrf_exempt
def ProductApi(request):
    if request.method =='GET':
        products = Products.objects.all()
        serializer = ProductsSerializer(products,many=True)
        return JsonResponse(serializer.data,safe=False)

items = {}
## Following request gets the data from the backend and returns the Json response of our product portfolio to the frontedn through a post method 
# connection = connections[settings.eyepro_db]
def analyst_portal(request):
    if request.method =='GET':
        with connection.cursor() as cursor:
            cursor.execute("""

                SELECT 
                    `products`.`product_id` AS `product_id`,
                    `man`.`entity_name` AS `manufacturer`,
                    `products`.`manuf_prod_num` AS `manuf_prod_num`,
                    `ven`.`entity_name` AS `vendor`,
                    `pv`.`sku` AS `sku`,
                    `products`.`description` AS `description`,
                    `categories`.`category_name` AS `category`,
                    `subcategories`.`subcategory_name` AS `subcategory`,
                    `pv`.`uom` AS `uom`,
                    `pv`.`units_in_uom` AS `units_in_uom`,
                    MAX((CASE
                        WHEN (`tiers`.`tier_name` = 'TIER 1') THEN `pv`.`price`
                        ELSE ''
                    END)) AS `tier1`,
                    ROUND((MAX((CASE
                                WHEN (`tiers`.`tier_name` = 'TIER 1') THEN `pv`.`price`
                                ELSE ''
                            END)) / `pv`.`units_in_uom`),
                            2) AS `tier1_per_unit`,
                    MAX((CASE
                        WHEN (`tiers`.`tier_name` = 'TIER 2') THEN `pv`.`price`
                        ELSE ''
                    END)) AS `tier2`,
                    ROUND((MAX((CASE
                                WHEN (`tiers`.`tier_name` = 'TIER 2') THEN `pv`.`price`
                                ELSE ''
                            END)) / `pv`.`units_in_uom`),
                            2) AS `tier2_per_unit`,
                    MAX((CASE
                        WHEN (`tiers`.`tier_name` = 'TIER 3') THEN `pv`.`price`
                        ELSE ''
                    END)) AS `tier3`,
                    ROUND((MAX((CASE
                                WHEN (`tiers`.`tier_name` = 'TIER 3') THEN `pv`.`price`
                                ELSE ''
                            END)) / `pv`.`units_in_uom`),
                            2) AS `tier3_per_unit`,
                    MAX((CASE
                        WHEN (`tiers`.`tier_name` = 'TIER 4') THEN `pv`.`price`
                        ELSE ''
                    END)) AS `tier4`,
                    ROUND((MAX((CASE
                                WHEN (`tiers`.`tier_name` = 'TIER 4') THEN `pv`.`price`
                                ELSE ''
                            END)) / `pv`.`units_in_uom`),
                            2) AS `tier4_per_unit`
                FROM
                    (((((((`products`
                    JOIN `entities` `man` ON ((`man`.`entity_id` = `products`.`manufacturer_id`)))
                    LEFT JOIN `categories` ON ((`categories`.`category_id` = `products`.`categories_category_id`)))
                    LEFT JOIN `subcategories` ON ((`subcategories`.`subcategory_id` = `products`.`subcategories_subcategory_id`)))
                    JOIN `products_has_vendors` `pv` ON ((`pv`.`products_product_id` = `products`.`product_id`)))
                    JOIN `tiers` ON ((`tiers`.`tier_id` = `pv`.`tiers_tier_id`)))
                    JOIN `vendors` ON ((`vendors`.`vendor_id` = `pv`.`vendors_vendor_id`)))
                    JOIN `entities` `ven` ON ((`ven`.`entity_id` = `vendors`.`vendor_id`)))
                WHERE
                    (`pv`.`active` = 1)
                GROUP BY `products`.`product_id` , `products`.`manuf_prod_num` , `man`.`entity_name` , `products`.`description` , `categories`.`category_name` , `subcategories`.`subcategory_name` , `pv`.`sku` , `pv`.`uom` , `pv`.`units_in_uom` , `ven`.`entity_name`



            """)

            result= [dict(zip([column[0] for column in cursor.description], row))
             for row in cursor.fetchall()]
            
            global items
            items = result
       # connection.__exit__ executes after this line   
            return JsonResponse(result, safe=False)         


# Limit products
def limit_analyst_portal(request):
    if request.method == 'GET':
        try:
            page = int(request.GET.get('page'))
        except TypeError:
            page = 1

        try:
            page_size = int(request.GET.get('page_size'))
        except TypeError:
            page_size = 50
        with connection.cursor() as cursor:
            cursor.execute("""

                SELECT 
                    `products`.`product_id` AS `product_id`,
                    `man`.`entity_name` AS `manufacturer`,
                    `products`.`manuf_prod_num` AS `manuf_prod_num`,
                    `ven`.`entity_name` AS `vendor`,
                    `pv`.`sku` AS `sku`,
                    `products`.`description` AS `description`,
                    `categories`.`category_name` AS `category`,
                    `subcategories`.`subcategory_name` AS `subcategory`,
                    `pv`.`uom` AS `uom`,
                    `pv`.`units_in_uom` AS `units_in_uom`,
                    MAX((CASE
                        WHEN (`tiers`.`tier_name` = 'TIER 1') THEN `pv`.`price`
                        ELSE ''
                    END)) AS `tier1`,
                    ROUND((MAX((CASE
                                WHEN (`tiers`.`tier_name` = 'TIER 1') THEN `pv`.`price`
                                ELSE ''
                            END)) / `pv`.`units_in_uom`),
                            2) AS `tier1_per_unit`,
                    MAX((CASE
                        WHEN (`tiers`.`tier_name` = 'TIER 2') THEN `pv`.`price`
                        ELSE ''
                    END)) AS `tier2`,
                    ROUND((MAX((CASE
                                WHEN (`tiers`.`tier_name` = 'TIER 2') THEN `pv`.`price`
                                ELSE ''
                            END)) / `pv`.`units_in_uom`),
                            2) AS `tier2_per_unit`,
                    MAX((CASE
                        WHEN (`tiers`.`tier_name` = 'TIER 3') THEN `pv`.`price`
                        ELSE ''
                    END)) AS `tier3`,
                    ROUND((MAX((CASE
                                WHEN (`tiers`.`tier_name` = 'TIER 3') THEN `pv`.`price`
                                ELSE ''
                            END)) / `pv`.`units_in_uom`),
                            2) AS `tier3_per_unit`,
                    MAX((CASE
                        WHEN (`tiers`.`tier_name` = 'TIER 4') THEN `pv`.`price`
                        ELSE ''
                    END)) AS `tier4`,
                    ROUND((MAX((CASE
                                WHEN (`tiers`.`tier_name` = 'TIER 4') THEN `pv`.`price`
                                ELSE ''
                            END)) / `pv`.`units_in_uom`),
                            2) AS `tier4_per_unit`
                FROM
                    (((((((`products`
                    JOIN `entities` `man` ON ((`man`.`entity_id` = `products`.`manufacturer_id`)))
                    LEFT JOIN `categories` ON ((`categories`.`category_id` = `products`.`categories_category_id`)))
                    LEFT JOIN `subcategories` ON ((`subcategories`.`subcategory_id` = `products`.`subcategories_subcategory_id`)))
                    JOIN `products_has_vendors` `pv` ON ((`pv`.`products_product_id` = `products`.`product_id`)))
                    JOIN `tiers` ON ((`tiers`.`tier_id` = `pv`.`tiers_tier_id`)))
                    JOIN `vendors` ON ((`vendors`.`vendor_id` = `pv`.`vendors_vendor_id`)))
                    JOIN `entities` `ven` ON ((`ven`.`entity_id` = `vendors`.`vendor_id`)))
                WHERE
                    (`pv`.`active` = 1)
                GROUP BY `products`.`product_id` , `products`.`manuf_prod_num` , `man`.`entity_name` , `products`.`description` , `categories`.`category_name` , `subcategories`.`subcategory_name` , `pv`.`sku` , `pv`.`uom` , `pv`.`units_in_uom` , `ven`.`entity_name`



            """)

        queryset = [dict(zip([column[0] for column in cursor.description], row))
                        for row in cursor.fetchall()]
        filterValue = request.GET.get('value', '')
        if filterValue != '':
            filtered_queryset = []
            for item in queryset:
                is_match = False
                for value in item.values():
                    if filterValue.lower() in str(value).lower():
                        is_match = True
                        break
                if is_match:
                    filtered_queryset.append(item)
            queryset = filtered_queryset

        # Perform pagination
        paginator = Paginator(queryset, page_size)
        page_objects = paginator.get_page(page)
        total_rows = len(queryset)

        response_data = {
            'total_rows': total_rows,
            'rows': page_objects.object_list,
            'value': filterValue
        }

        return JsonResponse(response_data, safe=False)

    # Return a default response for other HTTP methods
    return JsonResponse({'message': 'Method not allowed'}, status=405)       
        
# Market_basket 
def market_basket(request):
    if request.method == 'GET':
        try:
            page = int(request.GET.get('page'))
        except TypeError:
            page = 1

        try:
            page_size = int(request.GET.get('page_size'))
        except TypeError:
            page_size = 50
        queryset = MarketBasketTemp.objects.all()

        filterValue = request.GET.get('value', '')

        if filterValue != '':
            queryset = queryset.filter(
                Q(date_cln__icontains=filterValue) |
                Q(vendor_cln__icontains=filterValue) |
                Q(sku_cln__icontains=filterValue) |
                Q(invoice_number_cln__icontains=filterValue) |
                Q(description_cln__icontains=filterValue) |
                Q(quantity_cln__icontains=filterValue) |
                Q(price_cln__icontains=filterValue) |
                Q(total_cln__icontains=filterValue) 
            )

        # Perform pagination
        paginator = Paginator(queryset, page_size)
        page_objects = paginator.get_page(page)
        serializer = MarketBasketSerializerTemp(page_objects, many=True)
        total_rows = queryset.count()

        response_data = {
            'total_rows': total_rows,
            'rows': serializer.data,
            'value': filterValue
        }

        return JsonResponse(response_data, safe=False)

    # Return a default response for other HTTP methods
    return JsonResponse({'message': 'Method not allowed'}, status=405)

# Update data for market basket
@csrf_exempt
def update_market_basket(request):
    if request.method == 'PUT':
        global items
        try:
            json_data = json.loads(request.body)
            # Perform the update operation based on the JSON data
            json_data['issue_cln'] = 0
            json_data['error'] = 'null'
            json_data['error_column'] = 'null'
            check_product(json_data, items)
            # print(json_data)
            update_query = '''
                UPDATE market_basket_tmp
                SET date_cln = %(date_cln)s,
                    vendor_cln = %(vendor_cln)s,
                    sku_cln = %(sku_cln)s,
                    invoice_number_cln = %(invoice_number_cln)s,
                    description_cln = %(description_cln)s,
                    quantity_cln = %(quantity_cln)s,
                    price_cln = %(price_cln)s,
                    total_cln = %(total_cln)s,
                    issue_cln = %(issue_cln)s,
                    error_column = %(error_column)s,
                    error = %(error)s
                WHERE id = %(id)s
            '''

            with connection.cursor() as cursor:
                cursor.execute(update_query, json_data)

            return JsonResponse({'message': 'Update successful'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
# Delete data for market basket
@csrf_exempt
def delete_market_basket(request):
    if request.method == 'DELETE':
        try:
            json_data = json.loads(request.body)
            # Perform the update operation based on the JSON data

            update_query = '''
                DELETE FROM market_basket_tmp
                WHERE id = %(id)s
            '''

            with connection.cursor() as cursor:
                cursor.execute(update_query, json_data)

            return JsonResponse({'message': 'Delete successful'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
# Check issued product
def has_empty_value(product):
    # Function to check if any property of a product has an empty value
    for value in product.values():
        if value in [None, '']:  
            return True
    return False

def check_date(product):
    # Function to check if the date_cln property matches pattern "yyyy-mm-dd"
    date_pattern = r'^\d{4}-\d{2}-\d{2}$'
    # if 'date_cln' not in product:
    #     return bool(re.match(date_pattern, product['date']))
    # else:
    return bool(re.match(date_pattern, product['date_cln']))

def check_integer(product):
    # Function to check if invoice_number_cln and quantity_cln are valid integers
    invoice_number = product.get('invoice_number_cln')
    quantity = product.get('quantity_cln')
    if invoice_number is None or quantity is None:
        return False
    else:
        invoice_number_int = None
        quantity_int = None
        try:
            # Attempt to convert the values to integers
            invoice_number_int = int(invoice_number)
            quantity_int = int(quantity)
            # Check if the converted values match the original strings
            if (str(invoice_number_int) == invoice_number and str(quantity_int) == quantity):
                return True
        except ValueError:
            #Conversion to integer failed, return False
            if invoice_number_int is None:
                if (product['error_column'] == 'null'):
                    product['error_column'] = 'invoice_number_cln'
                    product['error'] = 'Invalid integer value at invoice_number_cln.'
                else:
                    product['error_column'] += ('\ninvoice_number_cln')
                    product['error'] += ('\nInvalid integer value at invoice_number_cln.')
            elif quantity_int is None:
                if (product['error_column'] == 'null'):
                    product['error_column'] = 'quantity_cln'
                    product['error'] = 'Invalid integer value at quantity_cln.'
                else: 
                    product['error_column'] += ('\nquantity_cln')
                    product['error'] += ('\nInvalid integer value at quantity_cln.')
            return False

def check_float(product):
    # Function to check if price_cln and total_cln are valid float numbers
    price = product.get('price_cln')
    total = product.get('total_cln')
    if price is None or total is None:
        return False
    else:
        price_float = None
        total_float = None

        try:
            # Attempt to convert the values to floats
            price_float = float(price)
            total_float = float(total)
            if price_float is not None and total_float is not None:
                return True  # Conversion succeeded
        except ValueError:
            if price_float is None:
                if (product['error_column'] == 'null'):
                    product['error_column'] = 'price_cln'
                    product['error'] = 'Invalid float value at price_cln.'
                else:
                    product['error_column'] += ('\nprice_cln')
                    product['error'] += ('\nInvalid float value at price_cln.')
            elif total_float is None:
                if (product['error_column'] == 'null'):
                    product['error_column'] = 'total_cln'
                    product['error'] = 'Invalid float value at total_cln.'
                else: 
                    product['error_column'] += ('\ntotal_cln')
                    product['error'] += ('\nInvalid float value at total_cln.')
            return False
    
def find_best_match(target, items):
    matches = process.extractOne(target, items, scorer=fuzz.token_set_ratio)
    return matches

def match_product(product, items):
    # Only check products with issue_cln = 0
    if (product['sku_cln'] not in [None, '']):
        sku_match = find_best_match(product['sku_cln'], [item['sku'] for item in items])
    else: sku_match = None
    # print(f"SKU match for {product['sku_cln']}: Score = {sku_match[1]}")
    # print(f"Description match for {product['description_cln']}: Score = {description_match[1]}")
    # Check if the similarity score for sku and description is greater than or equal to the threshold
    if sku_match is not None and sku_match[1] >= 80:
        if(product['error_column'] == 'null'):
            product['issue_cln'] = 0  # Set issue_cln to 0 if both sku and description are matched with specified similarity
    else:
        if (product['description_cln'] not in [None, '']):
            description_match = find_best_match(product['description_cln'], [item['description'] for item in items])
        else: description_match = None
        if description_match is not None and description_match[1] >= 80:
            if(product['error_column'] == 'null'):
                product['issue_cln'] = 0
        else:
            if (product['error_column'] == 'null'):
                product['error_column'] = 'sku_cln & description_cln'
            else:
                product['error_column'] += ('\nsku_cln & description_cln')
            if (product['error'] == 'null'):
                product['error'] = 'Product does not exist in product porfolio.'
            else:
                product['error'] += ('\nProduct does not exist in product porfolio.')
            product['issue_cln'] = 1

def check_product(product, items):
    if has_empty_value(product):
        product['issue_cln'] = 1
        product['error'] = 'Empty value(s).'
        product['error_column'] = 'empty'
    else:
        product['issue_cln'] = 0
        product['error'] = 'null'
        product['error_column'] = 'null'
    if not check_date(product):
        if (product['issue_cln'] != 1):
            product['issue_cln'] = 1
            product['error_column'] = 'date_cln'
            product['error'] = 'Date format is yyyy-mm-dd.'
        else: 
            product['error_column'] += '\ndate_cln'
            product['error'] += ('\nDate format is yyyy-mm-dd.')
    else:
        if(product['issue_cln'] != 1):
            product['issue_cln'] = 0
            product['error'] = 'null'
            product['error_column'] = 'null'
    if not check_integer(product):
        product['issue_cln'] = 1
    else:
        if(product['issue_cln'] != 1):
            product['issue_cln'] = 0
    if not check_float(product):
        product['issue_cln'] = 1    
    else:
        if(product['issue_cln'] != 1):
            product['issue_cln'] = 0
    match_product(product, items)

# Upload file from excel
@csrf_exempt
@api_view(['POST'])
def upload_file(request):
    if request.method == "POST":
        serializer = MarketBasketSerializerTemp(data=request.data, many=True)
        global items
        if serializer.is_valid():
            # print(serializer.validated_data)
            for product in serializer.validated_data:
                check_product(product, items)
            # print(serializer.validated_data)
            serializer.save()
            # Return a response indicating success
            return Response({'success': True, 'message': 'Data saved successfully'})
        else:
            return Response(serializer.errors, status=400)
    # Return a response for invalid request method
    return Response({'error': 'Invalid request method'}, status=405)

def vendor_suggestions(request):
    search_value = request.GET.get('search_value', '')
    vendors = MarketBasketTemp.objects.filter(
        Q(vendor_cln__icontains=search_value)
    ).values_list('vendor_cln', flat=True).distinct()

    return JsonResponse(list(vendors), safe=False)

# Market_basket 
def issue_market_basket(request):
    if request.method == 'GET':
        try:
            page = int(request.GET.get('page'))
        except TypeError:
            page = 1

        try:
            page_size = int(request.GET.get('page_size'))
        except TypeError:
            page_size = 50
        queryset = MarketBasketTemp.objects.filter(issue_cln=1)

        filterValue = request.GET.get('value', '')

        if filterValue != '':
            queryset = queryset.filter(
                Q(date_cln__icontains=filterValue) |
                Q(vendor_cln__icontains=filterValue) |
                Q(sku_cln__icontains=filterValue) |
                Q(invoice_number_cln__icontains=filterValue) |
                Q(description_cln__icontains=filterValue) |
                Q(quantity_cln__icontains=filterValue) |
                Q(price_cln__icontains=filterValue) |
                Q(total_cln__icontains=filterValue)  
            )

        # Perform pagination
        paginator = Paginator(queryset, page_size)
        page_objects = paginator.get_page(page)
        serializer = MarketBasketSerializerTemp(page_objects, many=True)
        total_rows = queryset.count()

        response_data = {
            'total_rows': total_rows,
            'rows': serializer.data,
            'value': filterValue
        }

        return JsonResponse(response_data, safe=False)

    # Return a default response for other HTTP methods
    return JsonResponse({'message': 'Method not allowed'}, status=405)

def get_columns(request, table_name):
    try:
        model_class = TABLE_MODEL_MAPPING.get(table_name)
        if model_class:
            model_fields = model_class._meta.get_fields()

            column_names = [field.name for field in model_fields]
            return JsonResponse({'columns': column_names})
        else:
            return JsonResponse({'error': 'Table not found'}, status=404)
    except AttributeError:
        return JsonResponse({'error': 'Table not found'}, status=404)
    
# @csrf_exempt
# def edit_form_submission(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         first_name = data.get("firstName")
#         last_name = data.get("lastName")
#         id =  data.get("id")
#         date =  data.get("date")
#         vendor =  data.get("vendor")
#         sku = data.get("sku")
#         invoice_number = data.get("invoice_number")
#         description = data.get("description")
#         quantity = data.get("quantity")
#         price = data.get("price")
#         total = data.get("total")
#         note = data.get("note")
#         your_email = f"{first_name[0].lower()}{last_name.lower()}@eyeprogpo.com"

#         # Send email using Django's send_mail function
#         send_mail(
#             "Edit Submission",
#             f"First Name: {first_name}\n"
#             f"Last Name: {last_name}\n"
#             f"ID: {id}\n"
#             f"Date: {date}\n"
#             f"Vendor: {vendor}\n"
#             f"SKU: {sku}\n"
#             f"Invoice Number: {invoice_number}\n"
#             f"Description: {description}\n"
#             f"Quantity: {quantity}\n"
#             f"Price: {price}\n"
#             f"Total: {total}\n"
#             f"Note: {note}",
#             from_email=settings.EMAIL_HOST_USER,
#             recipient_list=["kpham@eyeprogpo.com"],  # Recipient's email address
#             fail_silently=False,
#         )

#         return JsonResponse({"message": "Form submitted successfully"}, status=200)

#     return JsonResponse({"message": "Invalid request"}, status=400)

# @csrf_exempt
# def delete_form_submission(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         first_name = data.get("firstName")
#         last_name = data.get("lastName")
#         id =  data.get("id")
#         date =  data.get("date")
#         vendor =  data.get("vendor")
#         sku = data.get("sku")
#         invoice_number = data.get("invoice_number")
#         description = data.get("description")
#         quantity = data.get("quantity")
#         price = data.get("price")
#         total = data.get("total")
#         note = data.get("note")
#         note = data.get("note")
#         your_email = f"{first_name[0].lower()}{last_name.lower()}@eyeprogpo.com"
      

#         # Send email using Django's send_mail function
#         send_mail(
#             "Delete Submission",
#             f"First Name: {first_name}\n"
#             f"Last Name: {last_name}\n"
#             f"ID: {id}\n"
#             f"Date: {date}\n"
#             f"Vendor: {vendor}\n"
#             f"SKU: {sku}\n"
#             f"Invoice Number: {invoice_number}\n"
#             f"Description: {description}\n"
#             f"Quantity: {quantity}\n"
#             f"Price: {price}\n"
#             f"Total: {total}\n"
#             f"Note: {note}",
#             your_email, 
#             ["kpham@eyeprogpo.com"],  # Recipient's email address
#             fail_silently=False,
#         )

#         return JsonResponse({"message": "Form submitted successfully"}, status=200)

#     return JsonResponse({"message": "Invalid request"}, status=400)
