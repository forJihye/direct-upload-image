export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const elOnclick = (el: HTMLDivElement, handler: (ev: MouseEvent) => void) => el.addEventListener('click', handler);

export const getProjectUID = (params: string) => { 
  if (!params) {
    console.error('연결 된 프로젝트 UID 가 없습니다');
  }
  return params.split('?')[1];
}