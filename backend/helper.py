import datetime
import pytz


def extract_from_datetime(unix_timestamp, timezone, date_to_today=False, day_to_today=False):
    local_dt = datetime.datetime.fromtimestamp(unix_timestamp, pytz.timezone(timezone))
    current_dt = datetime.datetime.now(pytz.timezone(timezone))

    date_str = local_dt.strftime('%d/%m')
    time_str = local_dt.strftime('%I:%M %p')
    day_str = local_dt.strftime('%a')

    # Check if the date is today
    if date_to_today and local_dt.date() == current_dt.date():
        date_str = "TODAY"

    if day_to_today and local_dt.date() == current_dt.date():
        day_str = "TODAY"

    return date_str, time_str, day_str
