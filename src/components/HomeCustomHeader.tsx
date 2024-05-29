import React from 'react';
import { Appbar } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

interface HomeCustomHeaderProps {
  name: string;
  icon?: string | undefined;
  call?: any;
  isRead: boolean;
}

const HomeCustomHeader: React.FC<HomeCustomHeaderProps> = ({ name, icon, call, isRead }) => {
  const accountType = useSelector((state: any) => state.userProfile.accountType);

  const getHeaderColor = (accountType: string | null) => {
    if (accountType === 'PoliceStation') {
      return '#af952e';
    } else if(accountType === 'Hospital'){
      return '#008ECC'; 
    }
    else{
        return '#af952e';
    }
  };

  return (
    <Appbar.Header style={[styles.appHeader, { backgroundColor: getHeaderColor(accountType) }]}>
      <Appbar.Content title={name} color="white" titleStyle={styles.apptitle} />
      {icon && (
        <>
          <Appbar.Action icon={icon} onPress={call} color="white" size={25} />
          {isRead === false && <View style={styles.bellIcon}></View>}
        </>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  appHeader: {
    backgroundColor: '#af952e'
  },
  apptitle: {
    paddingLeft: 10,
    fontWeight: '700',
  },
  bellIcon: {
    borderWidth: 6,
    borderColor: '#fd5c63',
    borderRadius: 10,
    right: '45%',
    bottom: 8,
  },
});

export default HomeCustomHeader;




