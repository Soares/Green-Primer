from django import forms
from layouts.models import Layout

class LayoutForm(forms.ModelForm):
    class Meta:
        model = Layout
        exclude = 'json', 'user'

    def create(self, request):
        layout = self.save(commit=False)
        layout.user = request.user
        layout.save()
        return layout
