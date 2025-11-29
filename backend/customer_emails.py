"""
Customer Email Management using CSV
Stores customer emails without modifying the database
"""

import csv
import os
from typing import Optional
from datetime import datetime
import threading

# CSV file path
CSV_FILE = "customer_emails.csv"
CSV_LOCK = threading.Lock()

def init_csv():
    """Initialize CSV file if it doesn't exist"""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['tracking_id', 'customer_email', 'recipient_name', 'created_at'])
        print(f"✅ Created {CSV_FILE}")

def save_customer_email(tracking_id: str, customer_email: str, recipient_name: str = "") -> bool:
    """
    Save customer email to CSV file
    
    Args:
        tracking_id: Parcel tracking ID
        customer_email: Customer's email address
        recipient_name: Recipient's name (optional)
    
    Returns:
        bool: True if saved successfully
    """
    if not customer_email or not customer_email.strip():
        return False
    
    try:
        with CSV_LOCK:
            init_csv()
            
            # Check if tracking ID already exists
            existing_emails = {}
            if os.path.exists(CSV_FILE):
                with open(CSV_FILE, 'r', newline='', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        existing_emails[row['tracking_id']] = row
            
            # Update or add new entry
            existing_emails[tracking_id] = {
                'tracking_id': tracking_id,
                'customer_email': customer_email.strip(),
                'recipient_name': recipient_name,
                'created_at': datetime.utcnow().isoformat()
            }
            
            # Write back to CSV
            with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['tracking_id', 'customer_email', 'recipient_name', 'created_at'])
                writer.writeheader()
                for email_data in existing_emails.values():
                    writer.writerow(email_data)
        
        print(f"✅ Saved customer email for {tracking_id}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to save customer email: {str(e)}")
        return False

def get_customer_email(tracking_id: str) -> Optional[str]:
    """
    Get customer email by tracking ID
    
    Args:
        tracking_id: Parcel tracking ID
    
    Returns:
        str: Customer email if found, None otherwise
    """
    try:
        print(f"🔍 CSV Lookup: Searching for tracking_id='{tracking_id}'")
        
        if not os.path.exists(CSV_FILE):
            print(f"⚠️ CSV file not found: {CSV_FILE}")
            return None
        
        with CSV_LOCK:
            with open(CSV_FILE, 'r', newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                all_rows = list(reader)
                print(f"📊 CSV has {len(all_rows)} entries")
                
                for row in all_rows:
                    print(f"  Checking: '{row['tracking_id']}' == '{tracking_id}' ?")
                    if row['tracking_id'] == tracking_id:
                        print(f"✅ Found customer email: {row['customer_email']}")
                        return row['customer_email']
        
        print(f"❌ No match found for tracking_id: '{tracking_id}'")
        return None
        
    except Exception as e:
        print(f"❌ Failed to get customer email: {str(e)}")
        return None

def delete_customer_email(tracking_id: str) -> bool:
    """
    Delete customer email by tracking ID
    
    Args:
        tracking_id: Parcel tracking ID
    
    Returns:
        bool: True if deleted successfully
    """
    try:
        if not os.path.exists(CSV_FILE):
            return False
        
        with CSV_LOCK:
            # Read all entries except the one to delete
            entries = []
            with open(CSV_FILE, 'r', newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row['tracking_id'] != tracking_id:
                        entries.append(row)
            
            # Write back
            with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['tracking_id', 'customer_email', 'recipient_name', 'created_at'])
                writer.writeheader()
                writer.writerows(entries)
        
        print(f"✅ Deleted customer email for {tracking_id}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to delete customer email: {str(e)}")
        return False

def get_all_customer_emails() -> list:
    """
    Get all customer emails
    
    Returns:
        list: List of all customer email entries
    """
    try:
        if not os.path.exists(CSV_FILE):
            return []
        
        with CSV_LOCK:
            with open(CSV_FILE, 'r', newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                return list(reader)
        
    except Exception as e:
        print(f"❌ Failed to get all customer emails: {str(e)}")
        return []

def export_customer_emails(output_file: str = "customer_emails_export.csv") -> bool:
    """
    Export customer emails to a new CSV file
    
    Args:
        output_file: Output file path
    
    Returns:
        bool: True if exported successfully
    """
    try:
        if not os.path.exists(CSV_FILE):
            return False
        
        with CSV_LOCK:
            with open(CSV_FILE, 'r', newline='', encoding='utf-8') as f_in:
                with open(output_file, 'w', newline='', encoding='utf-8') as f_out:
                    f_out.write(f_in.read())
        
        print(f"✅ Exported customer emails to {output_file}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to export customer emails: {str(e)}")
        return False
