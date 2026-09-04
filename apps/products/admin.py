from django.contrib import admin
from .models import Product, Category, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'price', 'stock', 'status')
    list_filter = ('status', 'category')
    search_fields = ('name',)
    inlines = [ProductImageInline]


admin.site.register(Category)