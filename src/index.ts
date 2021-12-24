import './index.css';
import S from './selector';
import { getProjectUID, sleep } from './helper/utils';
import RouterDOM from './helper/routes';
import { computedWidth, fixImageDraw, rotateDraw } from './helper/canvas-draw';
import axios from 'axios';
import { MAX_IMAGE_WIDTH, POST_UPLOAD_API } from './config';
import { canvasToFile, fileToFormData } from './helper/canvas-to-file';

const r: DomSelector = { // 라우터 셀렉터
  intro: document.getElementById(S.ROUTE_INTRO) as HTMLDivElement,
  edit: document.getElementById(S.ROUTE_EDIT) as HTMLDivElement,
  upload: document.getElementById(S.ROUTE_ENDING) as HTMLDivElement
}
const p: DomSelector = { // 팝업 셀렉터
  error: document.getElementById(S.POPUP_UPLOAD_ERROR) as HTMLDivElement,
  wran: document.getElementById(S.POPUP_IMAGE_WRAN) as HTMLDivElement,
  upload: document.getElementById(S.POPUP_IMAGE_UPLOAD) as HTMLDivElement,
}
const c: DomSelector = { // 요소 셀렉터
  canvas: document.getElementById(S.IMAGE_CANVAS) as HTMLCanvasElement ,
  upload: document.getElementById(S.IMAGE_UPLOAD) as HTMLButtonElement,
  rotate: document.getElementById(S.IMAGE_ROTATE) as HTMLButtonElement,
}

const fileInput = (() => {
  const input = Object.assign(document.createElement('input'), {
    type: 'file',
    accept: 'image/*'
  });
  return input;
})();


const START_ROUTE = 'intro';
const main = async () => { try {
  const router = new RouterDOM(r);
  const popup = new RouterDOM(p);
  router.ready(START_ROUTE)
  popup.hide();

  const projectUID = getProjectUID(window.location.search);
  const img = new Image();
  const canvas = c.canvas as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D ;

  fileInput.addEventListener('change', (ev: Event) => {
    const target = ev.target as HTMLInputElement as {files: FileList};
    const files = target.files;
    if (!files && !(files as FileList).length) return;

    const onRevoke = () => URL.revokeObjectURL(img.src);
    img.onload = async () => {
      canvas && fixImageDraw(ctx, img);
      router.goto('edit');
      onRevoke();
    }
    img.onerror = async (ev) => {
      popup.goto('wran');
      await sleep(3000);
      popup.hide();
      onRevoke();
    }
    img.src = URL.createObjectURL(files[0]);
  })

  r.intro.addEventListener('click', (ev: Event) => {
    fileInput.click();
  });

  c.canvas.addEventListener('click', (ev: Event) => {
    fileInput.click();
  });
  
  c.rotate.addEventListener('click', (ev: Event) => {
    rotateDraw(ctx);
  });

  c.upload.addEventListener('click', async (ev: Event) => { 
    popup.goto('upload');
    try {
      const completeCanvas = computedWidth(canvas, MAX_IMAGE_WIDTH);
      const file = await canvasToFile(completeCanvas, {name: 'post.png', type: 'image/png'}) as File
      const form = await fileToFormData({ image: file, resolver: 'instagram' }) as FormData;
      await axios.post(POST_UPLOAD_API + projectUID, form);
      popup.hide();
      router.goto('upload');
      router.delayGoto('intro', 3000);
    } catch (error) {
      console.error(error);
      popup.goto('error');
      router.delayGoto('intro', 3000, () => popup.hide());
    }
    fileInput.value = '';
  });

} catch (error) {
  throw Error;
}}
main();