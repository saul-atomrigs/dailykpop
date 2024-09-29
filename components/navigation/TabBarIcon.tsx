import { CalendarPlus, ChatsCircle, Compass } from 'phosphor-react-native';
import { type ComponentProps } from 'react';

type IconProps = ComponentProps<typeof CalendarPlus> & {
  name: 'CalendarPlus' | 'ChatsCircle' | 'Compass';
};

export function TabBarIcon({ name, style, ...rest }: IconProps) {
  const IconComponent = getIconComponent(name);
  return (
    <IconComponent size={28} style={[{ marginBottom: -3 }, style]} testID={`${name}Icon`} {...rest} />
  );
}

function getIconComponent(name: IconProps['name']) {
  switch (name) {
    case 'CalendarPlus':
      return CalendarPlus;
    case 'ChatsCircle':
      return ChatsCircle;
    case 'Compass':
      return Compass;
    default:
      return CalendarPlus; // Fallback to a default icon
  }
}
