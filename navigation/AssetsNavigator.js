import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import AssetsScreen from '../screens/AssetsScreen';
import EditAssetScreen from '../screens/EditAssetScreen';
import AddAssetScreen from '../screens/AddAssetScreen';

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Assets';

export default function ConfigNavigator({ navigation, route }) {
    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    React.useEffect(()=> {
        navigation.setOptions({ headerTitle: getHeaderTitle(route) });
    }, [])

    return (
        <Stack.Navigator>
            <Stack.Screen name="ListAssets" component={AssetsScreen} options={{title: "Assets"}} />
            <Stack.Screen name="EditAssetScreen" component={EditAssetScreen} />
            <Stack.Screen name="AddAssetScreen" component={AddAssetScreen} options={{title: "Agregar Asset"}} />
        </Stack.Navigator>
    );
}



function getHeaderTitle(route) {
    // DEPRECATED
    // const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
    const routeName = getFocusedRouteNameFromRoute(route) ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'ListAssets':
            return 'Assets';
        case 'EditAssetScreen':
            return 'EditAssetScreen';
        case 'AddAssetScreen':
            return 'Agregar Asset';
    }
}
