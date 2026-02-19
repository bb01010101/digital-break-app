import {
  BarChart2,
  Newspaper,
  Shield,
  User,
  Users,
} from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { SizableText } from "tamagui";

const TabLabel = ({
  label,
  color,
  focused,
}: {
  label: string;
  color: string;
  focused: boolean;
}) => (
  <SizableText
    color={color}
    fontWeight={focused ? "bold" : undefined}
    fontSize={11}
    lineHeight={14}
  >
    {label}
  </SizableText>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          minHeight: Platform.OS === "ios" ? 88 : 70,
          borderTopWidth: 0.5,
          borderTopColor: "rgba(255,255,255,0.08)",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#4F8CFF",
        tabBarInactiveTintColor: "#6e6e6e",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Newspaper
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 1.8}
              style={{ marginTop: 6 }}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Feed" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BarChart2
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 1.8}
              style={{ marginTop: 6 }}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Stats" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="blocking"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Shield
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 1.8}
              style={{ marginTop: 6 }}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Blocking" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Users
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 1.8}
              style={{ marginTop: 6 }}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Friends" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <User
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 1.8}
              style={{ marginTop: 6 }}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <TabLabel label="Profile" color={color} focused={focused} />
          ),
        }}
      />
      {/* Hide old routes */}
      <Tabs.Screen name="overview" options={{ href: null }} />
      <Tabs.Screen name="apps" options={{ href: null }} />
    </Tabs>
  );
}
