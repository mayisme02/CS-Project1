import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Keyboard,
} from 'react-native';
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
  LatLng,
} from 'react-native-maps';
import Animated from 'react-native-reanimated';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';

const GOOGLE_API_KEY = 'AIzaSyBHkvOH59JWlGWWrGh3dyconyJXgG5YGjM'; // แก้เป็น API key ของคุณเอง

export default function TabTwoScreen() {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  const [region, setRegion] = useState<Region>({
    latitude: 16.475501563990804,
    longitude: 102.82504940900262,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [markers, setMarkers] = useState([
    {
      latitude: 16.475501563990804,
      longitude: 102.82504940900262,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      name: 'kku',
    },
  ]);
  const [searchText, setSearchText] = useState('');
  const [zoomLevel, setZoomLevel] = useState(0.01);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    if (useCurrentLocation) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'ไม่สามารถเข้าถึงตำแหน่งได้');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const currentRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        };
        setRegion(currentRegion);
        setMarkers([{ ...currentRegion, name: 'ตำแหน่งปัจจุบัน' }]);
      })();
    }
  }, [useCurrentLocation]);

  const searchLocation = async () => {
    if (!searchText) return;
    try {
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        searchText
      )}&inputtype=textquery&fields=geometry,name&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].geometry
      ) {
        const location = data.candidates[0].geometry.location;
        const newRegion = {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        setMarkers([
          {
            latitude: location.lat,
            longitude: location.lng,
            name: data.candidates[0].name,
            latitudeDelta: zoomLevel,
            longitudeDelta: zoomLevel,
          },
        ]);
        Keyboard.dismiss();
      } else {
        Alert.alert('ไม่พบสถานที่', 'กรุณาลองค้นหาใหม่');
      }
    } catch (error) {
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการค้นหา');
      console.error(error);
    }
  };

  const focusMap = () => {
    if (region) {
      mapRef.current?.animateToRegion(region, 1000);
    }
  };

  const zoomIn = () => {
    if (region && zoomLevel > 0.001) {
      const newZoom = zoomLevel / 2;
      setZoomLevel(newZoom);
      const newRegion = { ...region, latitudeDelta: newZoom, longitudeDelta: newZoom };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 500);
    }
  };

  const zoomOut = () => {
    if (region && zoomLevel < 1) {
      const newZoom = zoomLevel * 2;
      setZoomLevel(newZoom);
      const newRegion = { ...region, latitudeDelta: newZoom, longitudeDelta: newZoom };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 500);
    }
  };

  const onRegionChange = (region: Region) => {
    // console.log(region);
  };

  const handleMarkerPress = (coordinate: LatLng) => {
    Alert.alert(
      'ยืนยันการปักหมุด',
      `คุณต้องการปักหมุดที่ ละติจูด: ${coordinate.latitude.toFixed(5)}, ลองจิจูด: ${coordinate.longitude.toFixed(5)} หรือไม่?`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ยืนยัน',
          onPress: () => {
            const newMarker = {
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
              latitudeDelta: zoomLevel,
              longitudeDelta: zoomLevel,
              name: `ตำแหน่งใหม่: (${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)})`,
            };
            setMarkers([newMarker]);
            setRegion({ ...newMarker });
            mapRef.current?.animateToRegion(newMarker, 1000);
          },
        },
      ]
    );
  };

  return (
    <Animated.View style={{ flex: 1 }}>
      <Animated.View
        style={{
          height: 100,
          backgroundColor: '#f2bb14',
          paddingTop: 40,
          paddingHorizontal: 16,
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity onPress={focusMap}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Focus</Text>
        </TouchableOpacity>
      </Animated.View>
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
          <Text style={{ color: 'white', fontWeight: 'bold' }}>ค้นหา</Text>
        </TouchableOpacity>
      </View>
      {region && (
        <MapView
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation
          showsMyLocationButton
          onRegionChangeComplete={onRegionChange}
          ref={mapRef}
          onPress={e => {
            handleMarkerPress(e.nativeEvent.coordinate);
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              onPress={() => Alert.alert(marker.name)}
            >
              <Callout>
                <Animated.View style={{ padding: 10 }}>
                  <Text>{marker.name}</Text>
                </Animated.View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => setUseCurrentLocation(true)}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>ใช้ตำแหน่งปัจจุบัน</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20, // เพิ่มขอบโค้งให้ทันสมัย
    elevation: 6, // เพิ่มเงาให้เด่นชัด
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
    backgroundColor: '#f5f5f5', // พื้นหลังอ่อน ๆ
    color: '#333', // สีตัวอักษรเข้มขึ้น
  },
  searchButton: {
    backgroundColor: '#f2bb14',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4, // เพิ่มเงาให้ปุ่ม
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    bottom: 160,
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
  locationButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#f2bb14',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 4,
  },
});