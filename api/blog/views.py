from django.utils import timezone
from .serializers import PostSerializer, TagSerializer
from .permissions import IsUserOrReadOnly
from rest_framework import viewsets, filters
from taggit.models import Tag

from .models import Post


class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that lists blog posts tags
    """

    permissions_classes = (IsUserOrReadOnly,)
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that lists blog posts
    """

    permissions_classes = (IsUserOrReadOnly,)
    queryset = (
        Post.objects.all()
        .select_related("author")
        .filter(published__lte=timezone.now(), is_visible=True)
        .order_by("-published")
    )
    serializer_class = PostSerializer
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "title",
        "text",
        "^author__username",
        "author__first_name",
        "author__last_name",
    ]
    ordering_fields = ["created", "updated", "published"]
