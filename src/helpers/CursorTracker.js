import {
    Vector2,
    EventDispatcher
} from 'three'

export default class CursorTracker extends EventDispatcher {
    constructor(element) {
        super()
        this.element = element;
        this.mousePos = new Vector2();
        document.addEventListener('mousemove', (e) => { this.onDocumentMouseMove(e); }, false);
        document.addEventListener('mousedown', (e) => { this.onMouseDown(e); }, false);
    }

    onDocumentMouseMove(event) {
        event.preventDefault();
        this.mousePos.x = ((event.clientX + window.scrollX) / window.innerWidth) * 2 - 1;
        this.mousePos.y = -((event.clientY + window.scrollY) / window.innerHeight) * 2 + 1;
        
        this.dispatchEvent( { type: 'mouseposition', data: this.mousePos } );

        if(this.element != null){
            this.deltaToMouse = this.getDeltaToMouse();
            this.dispatchEvent( { type: 'deltaToMouse', data: this.deltaToMouse } );
        }
    }

    getDeltaToMouse(){
        if(!this.mousePos)
        {
          return;
        }

        var rect = this.element.getBoundingClientRect();
        let position = new Vector2(
        ((rect.left + window.pageXOffset + (this.element.clientWidth / 2) - (window.innerWidth / 2)) / window.innerWidth) * 2,
        -((rect.top + window.pageYOffset + (this.element.clientHeight / 2) - (window.innerHeight / 2)) / window.innerHeight) * 2
        );

        var deltaToMouse = new Vector2();
        deltaToMouse.subVectors(this.mousePos, position);
        return deltaToMouse;
    }

    onMouseDown(event) {
        // console.log("mouse position: (" + this.mouse.x + ", " + this.mouse.y + ")");
    }
}