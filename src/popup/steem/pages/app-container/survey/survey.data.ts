import { Survey } from '@popup/steem/pages/app-container/survey/survey.interface';

export const SurveyData: Survey = {
  id: 1,
  title: "Unlock Keychain’s potential with us",
  description: [
    'Take this 4 minutes survey to help us better understand how you use Keychain and what you would like to see in the next versions.',
    'The survey is anonymous but if you give us your username, you will get a special badge on SteemPro to celebrate your commitment!',
  ],
  image:
    'https://cdn.steemitimages.com/DQmZgWfn7uWbt3Z48snuLdTLHNukciPu9gsEW4ftHxVJMA7/steempro-keychain.png',
  link: 'https://forms.gle/PjrY9q61Nx1LUQfdA',
  expirationDate: new Date('2022-11-03'),
};
