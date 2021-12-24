// DocumentFragment는 DOM에 반영하기 전까지는 메모리상에서만 존재
// DocumentFragment에 변경이 일어나도 DOM의 구조에는 변경이 일어나지 않기 때문에 브라우저가 화면을 다시 랜더링 하지 않음.
const docFrag = document.createDocumentFragment();

class RouterDOM {
  _state!: string;
  _routesMap: RenderRoutes = new Map();
  _handler!: any;
  constructor(public _routes: DomSelector) {
    Object.keys(_routes).forEach(name => {
      this._routesMap.set(name, [document.createComment(''), _routes[name]]);
    });
  }
  hide(){
    this._routesMap.forEach(([comment, el], name, i) => {
      if (!el.parentElement) return;
      el.parentElement.replaceChild(comment, el)
      docFrag.appendChild(el);
    });
  }
  ready(startRoute: string){
    this._state = startRoute;
    this._routesMap.forEach(([comment, el], name, i) => {
      if (name === this._state) return;
      else {
        if (!el.parentElement) return;
        el.parentElement.replaceChild(comment, el)
        docFrag.appendChild(el);
      }
    });
  }
  setState(newState: string){
    this._state = newState;
    this.render();
  }
  render(){
    this._routesMap.forEach(([comment, el], name, i) => {
      if (name === this._state) {
        if (el.parentElement) return;
        comment.parentElement?.replaceChild(el, comment);
      } else {
        if (!el.parentElement) return;
        el.parentElement.replaceChild(comment, el)
        docFrag.appendChild(el);
      }
    });
  }
  goto(routeName: string) {
    this.setState(routeName);
  }
  delayGoto(routeName: string, delay: number, callback?: () => void) {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.goto(routeName);
      callback && callback();
    }, delay);
  }
}

export default RouterDOM