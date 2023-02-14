import { MantineThemeOverride } from '@mantine/styles/lib/theme/types';
import { action, makeObservable, observable } from 'mobx';

import Model from './model';

// https://mantine.dev/theming/theme-object/
export class ThemeModel extends Model<MantineThemeOverride> implements MantineThemeOverride {
  private readonly defaultFontSize = 16;

  @observable colorScheme: 'light' | 'dark' = 'light';
  @observable datesLocale = 'ru';
  @observable fontFamily = 'Open Sans, Helvetica, sans-serif';
  @observable headings = {
    fontFamily: this.fontFamily,
    fontWeight: 600,
    sizes: {
      h1: { fontSize: this.defaultFontSize + 14 },
      h2: { fontSize: this.defaultFontSize + 6 },
      h3: { fontSize: this.defaultFontSize + 2 },
      h4: { fontSize: this.defaultFontSize - 2 },
      h5: { fontSize: this.defaultFontSize - 4 },
      h6: { fontSize: this.defaultFontSize - 6 },
    },
  };

  @observable fontSizes = {
    xs: this.defaultFontSize - 4,
    sm: this.defaultFontSize - 2,
    md: this.defaultFontSize,
    lg: this.defaultFontSize + 2,
    xl: this.defaultFontSize + 4,
  };

  @observable other = {
    colorHeader: 'blue.9',
  };

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setFontSize(fontSize: number = this.defaultFontSize) {
    this.fontSizes = {
      xs: fontSize - 4,
      sm: fontSize - 2,
      md: fontSize,
      lg: fontSize + 2,
      xl: fontSize + 4,
    };
  }

  @action
  changeTheme(scheme?: 'light' | 'dark') {
    this.colorScheme = scheme || (this.colorScheme === 'dark' ? 'light' : 'dark');
  }
}

export default new ThemeModel();
