from django.forms import fields
from django.core.exceptions import ValidationError
import re

class BudgetField(fields.RegexField):
    def __init__(self, *args, **kwargs):
        self.regex = kwargs['regex'] = re.compile('^\s*\$?\s*(\d{1,3}([,]\d{3}){0,2}|\d{1,9})(\.\d{0,2})?\s*\$?\s*$')
        kwargs['error_message'] = 'Enter a number less than one billion'
        super(BudgetField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        from django.core.validators import EMPTY_VALUES
        if value in EMPTY_VALUES:
            return None
        if not self.regex.match(value):
            raise ValidationError(self.error_messages['invalid'])
        value = value.strip()
        if value.startswith('$'):
            value = value[1:]
        if value.endswith('$'):
            value = value[:-1]
        value = value.strip().replace(',', '')
        from decimal import Decimal, InvalidOperation
        try:
            return Decimal(value)
        except InvalidOperation:
            raise ValidationError(self.error_messages['invalid'])
