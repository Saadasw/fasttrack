"""
Email Service for FastTrack Courier
Sends email notifications for parcel status changes
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime

# Email configuration from environment variables
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@fasttrack.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Email enabled flag
EMAIL_ENABLED = bool(SMTP_USERNAME and SMTP_PASSWORD)


def send_email(to_email: str, subject: str, html_content: str, text_content: str = "") -> bool:
    """
    Send an email using SMTP
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content of the email
        text_content: Plain text fallback (optional)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    if not EMAIL_ENABLED:
        print(f"⚠️  Email not configured. Would have sent to {to_email}: {subject}")
        return False
    
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        # You can change "FastTrack Courier" to your company name
        message["From"] = f"FastTrack Courier <{ADMIN_EMAIL}>"
        message["To"] = to_email
        
        # Add text and HTML parts
        if text_content:
            part1 = MIMEText(text_content, "plain")
            message.attach(part1)
        
        part2 = MIMEText(html_content, "html")
        message.attach(part2)
        
        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
        
        print(f"✅ Email sent to {to_email}: {subject}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {str(e)}")
        return False


def get_status_display(status: str) -> dict:
    """Get display information for a status"""
    status_info = {
        "pending": {
            "label": "Pending",
            "color": "#FFA500",
            "icon": "⏳",
            "description": "Your parcel is waiting to be processed"
        },
        "assigned": {
            "label": "Assigned to Courier",
            "color": "#2196F3",
            "icon": "👤",
            "description": "A courier has been assigned to your parcel"
        },
        "picked_up": {
            "label": "Picked Up",
            "color": "#9C27B0",
            "icon": "📦",
            "description": "Your parcel has been picked up from the sender"
        },
        "in_transit": {
            "label": "In Transit",
            "color": "#3F51B5",
            "icon": "🚚",
            "description": "Your parcel is on its way to the destination"
        },
        "delivered": {
            "label": "Delivered",
            "color": "#4CAF50",
            "icon": "✅",
            "description": "Your parcel has been successfully delivered"
        },
        "returned": {
            "label": "Returned",
            "color": "#F44336",
            "icon": "↩️",
            "description": "Your parcel has been returned to the sender"
        },
        "cancelled": {
            "label": "Cancelled",
            "color": "#9E9E9E",
            "icon": "❌",
            "description": "This parcel has been cancelled"
        }
    }
    return status_info.get(status, status_info["pending"])


def send_status_change_email(
    merchant_email: str,
    merchant_name: str,
    tracking_id: str,
    old_status: str,
    new_status: str,
    recipient_name: str,
    notes: Optional[str] = None
) -> bool:
    """
    Send email notification when parcel status changes
    
    Args:
        merchant_email: Merchant's email address
        merchant_name: Merchant's name
        tracking_id: Parcel tracking ID
        old_status: Previous status
        new_status: New status
        recipient_name: Recipient's name
        notes: Optional notes about the status change
    
    Returns:
        bool: True if email sent successfully
    """
    status_info = get_status_display(new_status)
    tracking_url = f"{FRONTEND_URL}/tracking/{tracking_id}"
    
    subject = f"Parcel Status Update: {tracking_id} - {status_info['label']}"
    
    # HTML email template
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #2563eb; padding: 30px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">FastTrack Courier</h1>
                                <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Parcel Status Update</p>
                            </td>
                        </tr>
                        
                        <!-- Status Badge -->
                        <tr>
                            <td style="padding: 30px; text-align: center;">
                                <div style="display: inline-block; background-color: {status_info['color']}; color: #ffffff; padding: 12px 24px; border-radius: 25px; font-size: 18px; font-weight: bold;">
                                    {status_info['icon']} {status_info['label']}
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Hello <strong>{merchant_name}</strong>,
                                </p>
                                
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    {status_info['description']}
                                </p>
                                
                                <!-- Parcel Details -->
                                <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            <strong>Tracking ID:</strong>
                                        </td>
                                        <td style="color: #1e293b; font-size: 14px; font-family: monospace; border-bottom: 1px solid #e2e8f0;">
                                            {tracking_id}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            <strong>Recipient:</strong>
                                        </td>
                                        <td style="color: #1e293b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            {recipient_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            <strong>Previous Status:</strong>
                                        </td>
                                        <td style="color: #1e293b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            {get_status_display(old_status)['label']}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px;">
                                            <strong>Updated:</strong>
                                        </td>
                                        <td style="color: #1e293b; font-size: 14px;">
                                            {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}
                                        </td>
                                    </tr>
                                </table>
                                
                                {f'<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px;"><p style="color: #92400e; margin: 0; font-size: 14px;"><strong>Note:</strong> {notes}</p></div>' if notes else ''}
                                
                                <!-- Track Button -->
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="{tracking_url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                        Track Your Parcel
                                    </a>
                                </div>
                                
                                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    You can also track your parcel by visiting:<br>
                                    <a href="{tracking_url}" style="color: #2563eb; word-break: break-all;">{tracking_url}</a>
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0;">
                                <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0; text-align: center;">
                                    This is an automated notification from FastTrack Courier.<br>
                                    If you have any questions, please contact our support team.
                                </p>
                                <p style="color: #94a3b8; font-size: 11px; margin: 10px 0 0 0; text-align: center;">
                                    © {datetime.utcnow().year} FastTrack Courier. All rights reserved.
                                </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    # Plain text fallback
    text_content = f"""
    FastTrack Courier - Parcel Status Update
    
    Hello {merchant_name},
    
    Your parcel status has been updated!
    
    Tracking ID: {tracking_id}
    Recipient: {recipient_name}
    Previous Status: {get_status_display(old_status)['label']}
    New Status: {status_info['label']}
    
    {status_info['description']}
    
    {f'Note: {notes}' if notes else ''}
    
    Track your parcel: {tracking_url}
    
    Updated: {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}
    
    ---
    This is an automated notification from FastTrack Courier.
    © {datetime.utcnow().year} FastTrack Courier. All rights reserved.
    """
    
    return send_email(merchant_email, subject, html_content, text_content)


def send_parcel_created_email(
    merchant_email: str,
    merchant_name: str,
    tracking_id: str,
    recipient_name: str,
    recipient_address: str
) -> bool:
    """
    Send email notification when a new parcel is created
    
    Args:
        merchant_email: Merchant's email address
        merchant_name: Merchant's name
        tracking_id: Parcel tracking ID
        recipient_name: Recipient's name
        recipient_address: Recipient's address
    
    Returns:
        bool: True if email sent successfully
    """
    tracking_url = f"{FRONTEND_URL}/tracking/{tracking_id}"
    
    subject = f"Parcel Created: {tracking_id}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #10b981; padding: 30px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Parcel Created!</h1>
                                <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 14px;">Your parcel has been registered</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 30px;">
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Hello <strong>{merchant_name}</strong>,
                                </p>
                                
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Your parcel has been successfully created and registered in our system. You can now track its progress using the tracking ID below.
                                </p>
                                
                                <!-- Tracking ID Highlight -->
                                <div style="background-color: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                                    <p style="color: #064e3b; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">TRACKING ID</p>
                                    <p style="color: #047857; font-size: 24px; font-family: monospace; margin: 0; font-weight: bold; letter-spacing: 2px;">
                                        {tracking_id}
                                    </p>
                                </div>
                                
                                <!-- Parcel Details -->
                                <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            <strong>Recipient:</strong>
                                        </td>
                                        <td style="color: #1e293b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            {recipient_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            <strong>Destination:</strong>
                                        </td>
                                        <td style="color: #1e293b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                            {recipient_address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px;">
                                            <strong>Status:</strong>
                                        </td>
                                        <td style="color: #1e293b; font-size: 14px;">
                                            <span style="background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">⏳ PENDING</span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Track Button -->
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="{tracking_url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                        Track Your Parcel
                                    </a>
                                </div>
                                
                                <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0; border-radius: 4px;">
                                    <p style="color: #1e40af; margin: 0; font-size: 14px;">
                                        <strong>💡 Tip:</strong> Share the tracking link with your customer so they can monitor the delivery progress.
                                    </p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0;">
                                <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0; text-align: center;">
                                    This is an automated notification from FastTrack Courier.<br>
                                    © {datetime.utcnow().year} FastTrack Courier. All rights reserved.
                                </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    text_content = f"""
    FastTrack Courier - Parcel Created
    
    Hello {merchant_name},
    
    Your parcel has been successfully created!
    
    TRACKING ID: {tracking_id}
    
    Recipient: {recipient_name}
    Destination: {recipient_address}
    Status: Pending
    
    Track your parcel: {tracking_url}
    
    Share this tracking link with your customer so they can monitor the delivery.
    
    ---
    © {datetime.utcnow().year} FastTrack Courier. All rights reserved.
    """
    
    return send_email(merchant_email, subject, html_content, text_content)
