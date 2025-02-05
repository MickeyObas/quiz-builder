from rest_framework import serializers

from .models import User

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'nickname',
            'password',
            'profile_picture',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
        
    def validate_email(self, email):
        return email.strip()
    
    def validate_profile_picture(self, image):
        if image.size > 1024 * 1024:
            raise serializers.ValidationError("Image size exceeds 1 MB")
        if not image.content_type.startswith("image/"):
            raise serializers.ValidationError("Invald image format")

    def create(self, validated_data):
        user =  User.objects.create_user(**validated_data)
        return user
