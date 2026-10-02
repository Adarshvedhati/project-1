from django.contrib import admin

from .models import Alert, Bookmark, Subscription, UsageStat

admin.site.register(Alert)
admin.site.register(Bookmark)
admin.site.register(Subscription)
admin.site.register(UsageStat)
