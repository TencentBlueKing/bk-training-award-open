# -*- coding: utf-8 -*-
from blueking.component.utils import get_signature
from django.test import TestCase


class TestUtils(TestCase):

    def test_get_signature(self):
        params = {
            'method': 'GET',
            'path': '/blueking/component/',
            'app_secret': 'test',
            'params': {'p1': 1, 'p2': 'abc'},
        }
        signature = get_signature(**params)
        self.assertEqual(signature, 'S73XVZx3HvPRcak1z3k7jUkA7FM=')

        params = {
            'method': 'POST',
            'path': '/blueking/component/',
            'app_secret': 'test',
            'data': {'p1': 1, 'p2': 'abc'},
        }
        # python3 could sort the dict
        signature = get_signature(**params)
        self.assertIn(signature, ['qTzporCDYXqaWKuk/MNUXPT3A5U=', 'PnmqLk/8PVpsLHDFkolCQoi5lmg='])
