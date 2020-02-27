import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ReportsScreen from '../screens/ReportsScreen';
import AddRecordScreen from '../screens/AddRecordScreen';
import DocumentosScreen from '../screens/DocumentosScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'DashBoard',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-planet" />,
          // ASK. Como usar iconos Outlined??
        }}
      />
      <BottomTab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Informes',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
      <BottomTab.Screen
        name="AddRecordScreen"
        component={AddRecordScreen}
        options={{
          title: 'Añadir Registro',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-add-circle" />,
        }}
      />
      <BottomTab.Screen
        name="Documentos"
        component={DocumentosScreen}
        options={{
          title: 'Docs',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-document" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'DashBoard';
    case 'Reports':
      return 'Informes';
    case 'AddRecordScreen':
      return 'Añadir Registro';
    case 'Documentos':
      return 'Docs';
  }
}
