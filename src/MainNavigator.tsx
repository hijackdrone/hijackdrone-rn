import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import ControllerScreen from './ControllerScreen';
import DroneScreen from './DroneScreen';

const TabNavigator = createMaterialTopTabNavigator({
    Controller: ControllerScreen,
    Drone: DroneScreen,
    },
    {
        tabBarOptions:{
            tabStyle:{
                height: 150,
            }
        }
    }
);

export default createAppContainer(TabNavigator);