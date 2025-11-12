// strings/Strings.ts
export type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  image: any;
};

export const OnboardingStrings: OnboardingItem[] = [
  {
    id: '1',
    title: 'Spontánne stretnutia',
    description: 'Spoj sa s kamarátmi okamžite a plánuj spontánne výjazdy.',
    image: require('../assets/onboarding/slide1.png'),
  },
  {
    id: '2',
    title: 'Zdieľaj polohu',
    description: 'Sleduj trasu výjazdu v reálnom čase a buď vždy v obraze.',
    image: require('../assets/onboarding/slide2.png'),
  },
  {
    id: '3',
    title: 'Objav nové miesta',
    description: 'Naša AI ti navrhne lokácie a tipy, kam vyraziť.',
    image: require('../assets/onboarding/slide3.png'),
  },
];
