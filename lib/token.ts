export interface TokenData {
  key: string;
  value: string|null;
  driver: "localStorage" | "cookies";
  set: (token: string| null, tokenName?: string, storageName?: "localStorage" | "cookies") => void;
  get: () => string| null;
}

const token: TokenData = {
  key: '_token',
  value: '',
  driver: 'localStorage',
  set: function (token: string|null = null, tokenName: string = '_token', storageName: "localStorage" | "cookies" = 'localStorage') {
    this.key = tokenName;
    this.value = token;
    this.driver = storageName;

    if(this.value){
      if (this.driver === 'cookies') {
        document.cookie = `${this.key}=${this.value}; path=/`;
      } else {
        localStorage.setItem(this.key, this.value);
      }
    }
  },
  get: function () {
    if (this.driver === 'cookies') {
      const match = document.cookie.match(new RegExp('(^| )' + this.key + '=([^;]+)'));
      if (match) return match[2];
      return null;
    } else {
      return localStorage.getItem(this.key) || null;
    }
  }
};

export default token;
