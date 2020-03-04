import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LogoutScreen from '../screens/entrance/LogoutScreen';
import ConfigScreen from '../screens/ConfigScreen';

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Config';

export default function ConfigNavigator({ navigation, route }) {
    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    navigation.setOptions({ headerTitle: getHeaderTitle(route) });

    return (
        <Stack.Navigator>
            <Stack.Screen name="Config" component={ConfigScreen} />
            <Stack.Screen name="Logout" component={LogoutScreen} />
        </Stack.Navigator>
    );
}



function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Logout':
            return 'Logout';
    }
}
