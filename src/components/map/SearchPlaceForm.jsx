import React, { useCallback, useEffect, useState } from 'react';
import SearchLocation from './SearchLocation';
import SearchPlaceList from './SearchPlaceList';
import useGeolocation from '../../hooks/useGeolocation';
import { styled } from 'styled-components';
import { Toggle } from '../../elements/Toggle';
import Loading from '../../components/Loading';

export default function SearchPlaceForm() {
  const [place, setPlace] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const { location } = useGeolocation();

  const handleCurrentLocation = useCallback(async () => {
    setLoading(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setCurrentLocation({ latitude: lat, longitude: lon });
      setLoading(false);
    } catch (error) {
      const errorMessage =
        location && location.error.message
          ? location.error.message
          : '위치 정보 수집을 허용해주세요';
      alert(errorMessage);
      setLoading(false);
      setIsOn(false);
    }
  }, []);

  const handlePlaceChange = value => {
    setPlace(value);
  };

  const handleToggle = useCallback(() => {
    setIsOn(prevIsOn => !prevIsOn);
  }, []);

  useEffect(() => {
    if (isOn) {
      handleCurrentLocation();
    } else {
      setCurrentLocation(null);
    }
  }, [isOn, handleCurrentLocation]);

  return (
    <Wrapper>
      <Header>
        <Label htmlFor="search">모임 장소</Label>
        <SearchLocation onPlaceChange={handlePlaceChange} />
      </Header>
      <PlaceInfo>
        <PlaceLabel htmlFor="place">장소 목록</PlaceLabel>
        <ToggleWrapper>
          <ToggleLabel htmlFor="location">현 위치 중심</ToggleLabel>
          {loading ? <Loading type="circle" /> : <Toggle isOn={isOn} onToggle={handleToggle} />}
        </ToggleWrapper>
      </PlaceInfo>
      <Bar />
      <SearchPlaceList searchPlace={place} currentLocation={currentLocation} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 360px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  font-style: normal;
  font-weight: var(--font-weight-700);
  font-size: 0.75rem;
  line-height: 100%;
  padding: 1.5rem 0 0 1rem;
  letter-spacing: -0.015em;
`;

const PlaceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  height: 40px;
  gap: 126px;
  padding: 0 16px;
  margin-top: -1rem;
`;

const PlaceLabel = styled.label`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: -0.015em;
  color: #667085;
`;

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleLabel = styled.label`
  font-style: normal;
  font-weight: var(--font-weight-400);
  font-size: 0.85rem;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: right;
`;

const Bar = styled.div`
  height: 8px;
  width: 100%;
  background: var(--color-gray-100);
`;
