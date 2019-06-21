package com.commu_test;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.felhr.usbserial.UsbSerialDevice;
import com.felhr.usbserial.UsbSerialInterface;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;

import java.util.HashMap;
import java.util.Map;

public class UsbArduinoModule extends ReactContextBaseJavaModule {
    public final String ACTION_USB_PERMISSION = "com.hariharan.arduinousb.USB_PERMISSION";
    UsbManager usbManager;
    UsbDevice device;
    UsbSerialDevice serialPort;
    UsbDeviceConnection connection;

    ReactApplicationContext reactContext;
    public UsbArduinoModule(ReactApplicationContext reactContext){
        super(reactContext);
        this.reactContext = reactContext;
    }
    
    @Override
    public String getName(){
        return "UsbArduino";
    }

    @ReactMethod
    public void getArduino(Promise p){
        HashMap<String, UsbDevice> usbDevices = usbManager.getDeviceList();
        if (!usbDevices.isEmpty()) {
            for (Map.Entry<String, UsbDevice> entry : usbDevices.entrySet()) {
                device = entry.getValue();
                int deviceVID = device.getVendorId();
                if (deviceVID == 0x2341)//Arduino Vendor ID
                {
                    usbManager.requestPermission(device, pi);
                    connection = usbManager.openDevice(device);
                    serialPort = UsbSerialDevice.createUsbSerialDevice(device, connection);
                    if(serialPort != null) {
                        if (serialPort.open()) {
                            serialPort.setBaudRate(9600);
                            serialPort.setDataBits(UsbSerialInterface.DATA_BITS_8);
                            serialPort.setStopBits(UsbSerialInterface.STOP_BITS_1);
                            serialPort.setParity(UsbSerialInterface.PARITY_NONE);
                            p.resolve(true);
                        }
                    }
                } else {
                    connection = null;
                    device = null;
                    p.resolve(false);
                }
            }
        }
    }
    @ReactMethod
    public void writeArduino(String value, Promise p){
        serialPort.write(value.getBytes());
        p.resolve(true);
    }
}