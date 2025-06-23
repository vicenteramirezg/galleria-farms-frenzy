#!/usr/bin/env python3
"""
Generate a secure Django SECRET_KEY for production use.
Run this script and copy the output to your Railway environment variables.
"""

import secrets
import string

def generate_secret_key(length=50):
    """Generate a secure random secret key for Django."""
    # Use letters, digits, and some special characters
    alphabet = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    secret_key = ''.join(secrets.choice(alphabet) for _ in range(length))
    return secret_key

if __name__ == "__main__":
    print("🔐 Django Secret Key Generator")
    print("=" * 50)
    
    secret_key = generate_secret_key()
    
    print(f"Your secure SECRET_KEY:")
    print(f"SECRET_KEY={secret_key}")
    print()
    print("📋 Copy the line above and add it to your Railway backend service environment variables.")
    print("⚠️  Keep this secret! Never commit it to version control.")
    print("=" * 50) 