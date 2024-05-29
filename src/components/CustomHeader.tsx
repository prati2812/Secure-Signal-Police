import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

interface CustomHeaderProps {
  name: string;
  icon?: string;
  call?: any;
  backIcon?: string;
  backCall?: any;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ name, icon, call, backIcon, backCall }) => {
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

  const headerBackgroundColor = getHeaderColor(accountType);

  return (
    <Appbar.Header style={[styles.appHeader, { backgroundColor: headerBackgroundColor }]}>
      {backIcon && <Appbar.Action icon={backIcon} onPress={backCall} color='white' size={35} />}
      <Appbar.Content title={name} color='white' titleStyle={styles.apptitle} />
      {icon && <Appbar.Action icon={icon} onPress={call} color='white' />}
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
});

export default CustomHeader;
