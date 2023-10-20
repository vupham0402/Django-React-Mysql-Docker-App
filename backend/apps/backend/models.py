# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

# This comment means alot - Clay

class Categories(models.Model):
    category_id = models.CharField(primary_key=True, max_length=11)
    category_name = models.CharField(unique=True, max_length=45)
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'categories'


class EditNotification(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    productid = models.CharField(db_column='ProductID', max_length=255)  # Field name made lowercase.
    vendor = models.CharField(db_column='Vendor', max_length=255)  # Field name made lowercase.
    sku = models.CharField(db_column='SKU', max_length=45)  # Field name made lowercase.
    description = models.TextField(db_column='Description')  # Field name made lowercase.
    uom = models.CharField(db_column='UoM', max_length=45)  # Field name made lowercase.
    qty = models.IntegerField(db_column='Qty')  # Field name made lowercase.
    tier1 = models.CharField(db_column='Tier1', max_length=45)  # Field name made lowercase.
    tier2 = models.CharField(db_column='Tier2', max_length=45)  # Field name made lowercase.
    tier3 = models.CharField(db_column='Tier3', max_length=45)  # Field name made lowercase.
    tier4 = models.CharField(db_column='Tier4', max_length=45)  # Field name made lowercase.
    active = models.IntegerField(db_column='Active')  # Field name made lowercase.
    datetime = models.DateTimeField(db_column='DateTime')  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255)  # Field name made lowercase.
    note = models.TextField(db_column='Note')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'edit_notification'


class Entities(models.Model):
    entity_id = models.CharField(primary_key=True, max_length=11)
    entity_name = models.CharField(unique=True, max_length=45)
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'entities'


class MemberTemp(models.Model):
    description = models.CharField(db_column='Description', max_length=255)  # Field name made lowercase.
    catalognumber = models.CharField(db_column='CatalogNumber', max_length=45, blank=True, null=True)  # Field name made lowercase.
    eachqty = models.IntegerField(db_column='EachQty')  # Field name made lowercase.
    totalcost = models.DecimalField(db_column='TotalCost', max_digits=15, decimal_places=2)  # Field name made lowercase.
    vendor = models.CharField(db_column='Vendor', max_length=50)  # Field name made lowercase.
    price_per = models.DecimalField(max_digits=15, decimal_places=2)
    exact_match = models.IntegerField(blank=True, null=True)
    db_sku = models.CharField(max_length=45)
    db_description = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'member_temp'


class Members(models.Model):
    member = models.OneToOneField(Entities, models.DO_NOTHING, primary_key=True)
    peg = models.CharField(max_length=45, blank=True, null=True)
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'members'


class MembersHasVendors(models.Model):
    members_member = models.OneToOneField(Members, models.DO_NOTHING, primary_key=True)
    vendors_vendor = models.ForeignKey('Vendors', models.DO_NOTHING)
    tiers_tier = models.ForeignKey('Tiers', models.DO_NOTHING)
    eyepro_tier = models.IntegerField()
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'members_has_vendors'
        unique_together = (('members_member', 'vendors_vendor', 'tiers_tier'),)


class NumgenSeq(models.Model):

    class Meta:
        managed = False
        db_table = 'numGen_seq'


class PriceArchive(models.Model):
    price_archive = models.OneToOneField('ProductsHasVendors', models.DO_NOTHING, primary_key=True)
    pa_price = models.DecimalField(max_digits=15, decimal_places=2)
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'price_archive'
        unique_together = (('price_archive', 'modified_at'),)


class Products(models.Model):
    product_id = models.CharField(primary_key=True, max_length=60)
    manufacturer = models.ForeignKey(Entities, models.DO_NOTHING)
    manuf_prod_num = models.CharField(max_length=45)
    description = models.CharField(max_length=255, db_collation='utf8mb4_0900_ai_ci')
    unspsc = models.CharField(max_length=45, blank=True, null=True)
    katena_mfr = models.CharField(max_length=11, blank=True, null=True)
    categories_category = models.ForeignKey(Categories, models.DO_NOTHING, blank=True, null=True)
    subcategories_subcategory = models.ForeignKey('Subcategories', models.DO_NOTHING, blank=True, null=True)
    gtn_upc = models.BigIntegerField(blank=True, null=True)
    family = models.CharField(max_length=45, blank=True, null=True)
    active = models.IntegerField()
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'products'
        unique_together = (('product_id', 'manufacturer', 'manuf_prod_num'),)


class ProductsHasVendors(models.Model):
    product_has_vendor_id = models.CharField(primary_key=True, max_length=100)
    products_product = models.ForeignKey(Products, models.DO_NOTHING)
    vendors_vendor = models.ForeignKey('Vendors', models.DO_NOTHING)
    sku = models.CharField(max_length=45)
    uom = models.CharField(max_length=11, db_collation='utf8mb4_0900_ai_ci', blank=True, null=True)
    units_in_uom = models.IntegerField()
    tiers_tier = models.ForeignKey('Tiers', models.DO_NOTHING)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    active = models.IntegerField()
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'products_has_vendors'
        unique_together = (('product_has_vendor_id', 'vendors_vendor', 'sku', 'tiers_tier'),)


class Subcategories(models.Model):
    subcategory_id = models.CharField(primary_key=True, max_length=11)
    subcategory_name = models.CharField(unique=True, max_length=45)
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'subcategories'


class Tiers(models.Model):
    tier_id = models.CharField(primary_key=True, max_length=11)
    tier_name = models.CharField(unique=True, max_length=11)
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'tiers'

class UserInput(models.Model):
    member_name = models.CharField(primary_key=True, max_length=255)
    dba_applicable = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_input'

class Vendors(models.Model):
    vendor = models.OneToOneField(Entities, models.DO_NOTHING, primary_key=True)
    tier_description = models.CharField(max_length=255, db_collation='utf8mb4_0900_ai_ci', blank=True, null=True)
    vendor_img = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'vendors'

##Creating the table used to load in json information BEFORE the first pass of member cleanup -Clay
class MarketBasketSRC(models.Model):
    data_src = models.DateTimeField()
    vendor_src =  models.CharField( max_length=45)
    sku_src = models.CharField( max_length=45)
    invoice_number_src = models.IntegerField()
    description_src = models.CharField( max_length=300)
    quantity_src = models.IntegerField()
    price_src = models.IntegerField()
    total_src = models.IntegerField()
    index_src = models.IntegerField() # The source index for traceback of data will persist through each phase of cleaning

    class Meta:
        #managed = False
        db_table = 'market_basket_src'

##This will hold cleaned data from Market Basket AFTER the first pass of member cleanup -Clay
class MarketBasketCLN(models.Model):
    id = models.AutoField(primary_key=True) 
    data_cln = models.CharField(max_length=45)
    vendor_cln =  models.CharField( max_length=45)
    sku_cln = models.CharField( max_length=45)
    invoice_number_cln = models.CharField( max_length=45)
    description_cln = models.CharField( max_length=300)
    quantity_cln = models.CharField( max_length=45)
    price_cln = models.CharField( max_length=45)
    total_cln = models.CharField( max_length=45)
    index_src = models.IntegerField() # We will keep the source index for traceback of data

    class Meta:
        #managed = False
        db_table = 'market_basket_cln'

## This will hold the data after entire process is FINISHED
class MarketBasketFIN(models.Model):
    data_fin = models.DateTimeField()
    vendor_fin =  models.CharField( max_length=45)
    sku_fin = models.CharField( max_length=45)
    invoice_number_fin = models.IntegerField()
    description_fin = models.CharField( max_length=300)
    quantity_fin = models.IntegerField()
    price_fin = models.IntegerField()
    total_fin = models.IntegerField()
    index_src = models.IntegerField() # We will keep the source index for traceback of data

    class Meta:
        #managed = False
        db_table = 'market_basket_fin'

class MarketBasketTemp(models.Model):
    id = models.AutoField(primary_key=True) 
    date_cln = models.CharField(max_length=45, null=True, blank=True)
    vendor_cln =  models.CharField( max_length=45, null=True, blank=True)
    sku_cln = models.CharField( max_length=45, null=True, blank=True)
    invoice_number_cln = models.CharField( max_length=45, null=True, blank=True)
    description_cln = models.CharField( max_length=300, null=True, blank=True)
    quantity_cln = models.CharField( max_length=45, null=True, blank=True)
    price_cln = models.CharField( max_length=45, null=True, blank=True)
    total_cln = models.CharField( max_length=45, null=True, blank=True)
    issue_cln = models.IntegerField(null=True, blank=True) 
    error_column = models.CharField( max_length=255, null=True, blank=True)
    error = models.CharField( max_length=255, null=True, blank=True)

    class Meta:
        #managed = False
        db_table = 'market_basket_tmp'

