#!/usr/bin/env bash

CURRENT_WLAN=$(iwconfig wlan0 | grep "ESSID" | awk {'print $4'})
if [ $CURRENT_WLAN == 'ESSID:"ZTE-bYe6RK"' ]; then
        cp /etc/wpa_supplicant/wpa_supplicant.conf.act /etc/wpa_supplicant/wpa_supplicant.conf
else
        cp /etc/wpa_supplicant/wpa_supplicant.conf.hathway /etc/wpa_supplicant/wpa_supplicant.conf
fi

reboot