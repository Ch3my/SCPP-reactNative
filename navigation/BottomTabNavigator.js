import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ReportsScreen from '../screens/ReportsScreen';
import AddRecordScreen from '../screens/AddRecordScreen';
import DocsScreen from '../screens/DocsScreen';

import { createStackNavigator } from '@react-navigation/stack';
import ConfigNavigator from './ConfigNavigator';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  // navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  // ==========================================================================
  // == Se crea un Stack por cada pantalla, asi podemos tener 
  // == mas control de cada cosa
  const HomeNavigator = createStackNavigator();
  const HomeScreenStack = () => {
    return (
      <HomeNavigator.Navigator>
        <HomeNavigator.Screen name="Dashboard" component={HomeScreen} />
      </HomeNavigator.Navigator>
    )
  }

  const DocsNavigator = createStackNavigator();
  const DocsScreenStack = () => {
    return (
      <DocsNavigator.Navigator>
        <DocsNavigator.Screen name="Docs" component={DocsScreen} />
      </DocsNavigator.Navigator>
    )
  }

  const AddRecordNavigator = createStackNavigator();
  const AddRecordScreenStack = () => {
    return (
      <AddRecordNavigator.Navigator>
        <AddRecordNavigator.Screen name="Añadir Registro" component={AddRecordScreen} />
      </AddRecordNavigator.Navigator>
    )
  }

  const ReportsNavigator = createStackNavigator();
  const ReportsScreenStack = () => {
    return (
      <ReportsNavigator.Navigator>
        <ReportsNavigator.Screen name="Reportes" component={ReportsScreen} />
      </ReportsNavigator.Navigator>
    )
  }


  // Escondemos los Label del TabNavigation para hacerlo mas parecido a Instagram
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={{ showLabel: false }} >
      <BottomTab.Screen
        name="Home"
        component={HomeScreenStack}
        options={{
          title: 'DashBoard',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-planet" />,
          // ASK. Como usar iconos Outlined??
        }}
      />
      <BottomTab.Screen
        name="Documentos"
        component={DocsScreenStack}
        options={{
          title: 'Docs',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-document" />,
        }}
      />
      <BottomTab.Screen
        name="AddRecordScreen"
        component={AddRecordScreenStack}
        options={{
          title: 'Añadir Registro',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-add-circle" />,
        }}
      />
      <BottomTab.Screen
        name="Reports"
        component={ReportsScreenStack}
        options={{
          title: 'Informes',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
      {/* <BottomTab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          title: 'Logout',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-log-out" />,
        }}
      /> */}
      <BottomTab.Screen
        name="Config"
        component={ConfigNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-cog" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// function getHeaderTitle(route) {
//   const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

//   switch (routeName) {
//     case 'Home':
//       return 'DashBoard';
//     case 'Reports':
//       return 'Informes';
//     case 'AddRecordScreen':
//       return 'Añadir Registro';
//     case 'Documentos':
//       return 'Docs';
//     case 'Config':
//       return 'Config';
//   }
// }
