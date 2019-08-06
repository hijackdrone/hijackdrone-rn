import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import ControllerScreen from './ControllerScreen';
import DroneScreen from './DroneScreen';

const TabNavigator = createMaterialTopTabNavigator({
    Controller: ControllerScreen,
    Drone: DroneScreen,
    },
    {
        tabBarOptions:{
            // activeTintColor: '#343434',
            // inactiveTintColor: 'red',
            labelStyle:{
                marginTop: 10,
                fontSize: 15,
            },
            tabStyle:{
                height: 50,
            },
            style: {
                backgroundColor: '#005089',
            },
            indicatorStyle: {
                backgroundColor: '#0C9BA9',
            }
        },
    }
);

export default createAppContainer(TabNavigator);