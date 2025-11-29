"""
Test CSV customer email lookup
"""

from customer_emails import get_customer_email, get_all_customer_emails

print("=" * 50)
print("Testing CSV Customer Email Lookup")
print("=" * 50)

# Show all entries
print("\n📋 All entries in CSV:")
all_emails = get_all_customer_emails()
for entry in all_emails:
    print(f"  Tracking ID: '{entry['tracking_id']}'")
    print(f"  Email: '{entry['customer_email']}'")
    print(f"  Name: '{entry['recipient_name']}'")
    print()

# Test lookup
if all_emails:
    test_tracking_id = all_emails[0]['tracking_id']
    print(f"\n🔍 Testing lookup for: '{test_tracking_id}'")
    result = get_customer_email(test_tracking_id)
    print(f"Result: {result}")
else:
    print("\n⚠️ No entries in CSV file")
