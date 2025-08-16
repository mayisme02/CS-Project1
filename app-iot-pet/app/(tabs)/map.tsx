import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity, TextInput, Modal, useWindowDimensions } from 'react-native';
import MapView, { Marker, Callout, LatLng, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomMarker {
  latitude: number;
  longitude: number;
  name?: string;
}

const initialRegion = {
  latitude: 16.475501563990804,
  longitude: 102.82504940900262,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function Maps() {
  const mapRef = useRef<MapView>(null);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [region, setRegion] = useState<Region>(initialRegion);
  const [markers, setMarkers] = useState<CustomMarker[]>([
    { latitude: initialRegion.latitude, longitude: initialRegion.longitude, name: 'จุดเริ่มต้น' },
  ]);
  const [searchText, setSearchText] = useState('');
  const [zoomLevel, setZoomLevel] = useState(0.05);
  const [modalVisible, setModalVisible] = useState(false);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'ไม่สามารถเข้าถึงตำแหน่งได้');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const currentLocation: CustomMarker = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: 'ตำแหน่งปัจจุบัน',
      };
      setMarkers([currentLocation]);
      setRegion({
        ...region,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      mapRef.current?.animateToRegion(
        {
          ...region,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        1000
      );
      setModalVisible(false);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเข้าถึงตำแหน่งได้');
    }
  };

  const zoomIn = () => {
    if (zoomLevel > 0.001) {
      const newZoom = zoomLevel / 2;
      setZoomLevel(newZoom);
      updateRegionZoom(newZoom);
    }
  };

  const zoomOut = () => {
    if (zoomLevel < 1) {
      const newZoom = zoomLevel * 2;
      setZoomLevel(newZoom);
      updateRegionZoom(newZoom);
    }
  };

  const updateRegionZoom = (newZoom: number) => {
    const newRegion = { ...region, latitudeDelta: newZoom, longitudeDelta: newZoom };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
  };

  const handleMapPress = () => {
    setModalVisible(true);
  };

  // ใช้ environment variable แทน hardcode API key
  const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
  
  const searchLocation = async () => {
    if (!searchText.trim()) {
      Alert.alert('กรุณากรอกสถานที่');
      return;
    }

    if (GOOGLE_API_KEY === 'YOUR_API_KEY_HERE') {
      Alert.alert('API Key Required', 'กรุณาตั้งค่า Google Maps API Key');
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: { address: searchText, key: GOOGLE_API_KEY, language: 'th' },
        }
      );
      if (response.data.status === 'OK') {
        const { lat, lng } = response.data.results[0].geometry.location;
        const newLocation: CustomMarker = {
          latitude: lat,
          longitude: lng,
          name: searchText,
        };
        setMarkers([newLocation]);
        setRegion({
          ...region,
          latitude: lat,
          longitude: lng,
        });
        mapRef.current?.animateToRegion(
          {
            ...region,
            latitude: lat,
            longitude: lng,
          },
          1000
        );
        setSearchText('');
      } else {
        Alert.alert('ไม่พบสถานที่', `ไม่พบผลลัพธ์สำหรับ "${searchText}"`);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถค้นหาสถานที่ได้');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="ค้นหาสถานที่..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          onSubmitEditing={searchLocation}
          returnKeyType="search"
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={searchLocation} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>ค้นหา</Text>
        </TouchableOpacity>
      </View>
      
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        region={region}
        showsUserLocation
        showsMyLocationButton
        onPress={handleMapPress}
      >
        {markers.map((marker, index) => (
          <Marker key={`main-${index}`} coordinate={marker}>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{marker.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ยืนยันตำแหน่งที่เลือก</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.locationConfirmButton} onPress={getCurrentLocation}>
                <Text style={styles.textButton}>ใช้ตำแหน่งปัจจุบัน</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.bottomWhiteSpace, { bottom: insets.bottom + 65, height: height * 0.2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#f2bb14',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    bottom: 280,
    flexDirection: 'column',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    elevation: 6,
  },
  zoomButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomWhiteSpace: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 11,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    marginHorizontal: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  locationConfirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  textButton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  calloutContainer: {
    minWidth: 100,
    padding: 5,
  },
  calloutText: {
    fontSize: 14,
    textAlign: 'center',
  },
});