import datetime
import pytz


def unix_to_datetime(unix_timestamp, timezone):
    local_dt = datetime.datetime.fromtimestamp(unix_timestamp, pytz.timezone(timezone))
    date_str = local_dt.strftime('%d/%m')
    time_str = local_dt.strftime('%I:%M %p')

    return date_str, time_str
