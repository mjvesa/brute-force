class BruteForce extends HTMLElement {
  constructor() {
    super();

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .panels {
        display: flex;
        justify-content: flex-start;
      }
      
      #container {
        width: 600px;
        height: 600px;
        border: solid 1px black;
        overflow: hidden;
        user-select: none;
        z-index: 4;
      }
      
      
      #css-props {
        width: 600px;
        height: 600px;
        border: solid 1px black;
        white-space: pre;
      }

      
      .drag-handle {
        position: absolute;
        width: 30px;
        height: 30px;
        z-index: 3;
      }
      
      .block {
        position: absolute;
        width: 100px;
        height: 100px;
        border: solid 1px black;
        background-color: green;
        font-size: 40px;
        color: white;
        z-index: 2;
        cursor: grab;
      }
      
     #flex-container {
        display: flex;
        width: 600px;
        height: 600px;
        border: solid 1px black;
        overflow: hidden;
      }


      .flex-block {
        min-width: 100px;
        min-height: 100px;
        border: solid 1px black;
        background-color: blue;
        font-size: 40px;
        color: white;
      }
      
      #nw-drag-handle {
        cursor: nw-resize;
      }

      #ne-drag-handle {
        cursor: ne-resize;
      }

      #se-drag-handle {
        cursor: se-resize;
      }

      #sw-drag-handle {
        cursor: sw-resize;
      }`;

    this.innerHTML = `
    <div class="panels">
      <div id="container">
        <div id="nw-drag-handle" class="drag-handle"></div>
        <div id="ne-drag-handle" class="drag-handle"></div>
        <div id="se-drag-handle" class="drag-handle"></div>
        <div id="sw-drag-handle" class="drag-handle"></div>
      </div>
      
      <div id="flex-container">
      </div>

    </div>
    <span>
      <button id="flex-box-me">Flexbox Me</button>
      <button id="add-block">Add Block</button>
    </span>`;

    this.appendChild(styleEl);

    let current_rect;
    let current_drag_handle;
    let block_count = 0;
    const blocks = [];
    const flexblocks = [];

    const container = document.getElementById("container");
    const nw = document.getElementById("nw-drag-handle");
    const ne = document.getElementById("ne-drag-handle");
    const se = document.getElementById("se-drag-handle");
    const sw = document.getElementById("sw-drag-handle");

    let target;
    let block_clicked = (event, drag_handle) => {
      target = event.target;
      current_drag_handle = drag_handle;
    };

    const block_unclicked = event => {
      target = undefined;
    };

    const drag_handle_mouse_over = event => {
      event.stopPropagation();
    };

    nw.onmousedown = event => {
      block_clicked(event, "nw");
    };
    ne.onmousedown = event => {
      block_clicked(event, "ne");
    };
    se.onmousedown = event => {
      block_clicked(event, "se");
    };
    sw.onmousedown = event => {
      block_clicked(event, "sw");
    };

    nw.onmouseover = drag_handle_mouse_over;
    ne.onmouseover = drag_handle_mouse_over;
    sw.onmouseover = drag_handle_mouse_over;
    se.onmouseover = drag_handle_mouse_over;

    const place_drag_handles = event => {
      const el = event.target;
      current_rect = el;
      nw.style.left = el.offsetLeft - 15 + "px";
      nw.style.top = el.offsetTop - 15 + "px";
      ne.style.left = el.offsetLeft + el.offsetWidth - 15 + "px";
      ne.style.top = el.offsetTop - 15 + "px";
      se.style.left = el.offsetLeft + el.offsetWidth - 15 + "px";
      se.style.top = el.offsetTop + el.offsetHeight - 15 + "px";
      sw.style.left = el.offsetLeft - 15 + "px";
      sw.style.top = el.offsetTop + el.offsetHeight - 15 + "px";
      event.stopPropagation();
    };

    const clear_drags = () => {
      current_drag_handle = undefined;
    };

    const add_block = () => {
      block_count++;
      const block = document.createElement("div");
      block.className = "block";
      block.onmouseover = place_drag_handles;
      block.onmouseup = clear_drags;
      block.onmousedown = event => {
        block_clicked(event, "");
      };
      const flex_block = document.createElement("div");
      flex_block.className = "flex-block";
      block.textContent = block_count + "";
      flex_block.textContent = block_count + "";

      document.getElementById("container").appendChild(block);
      document.getElementById("flex-container").appendChild(flex_block);

      blocks.push(block);
      flexblocks.push(flex_block);
    };

    const start_drag_from_handle = handle => {
      current_drag_handle = handle;
    };

    add_block();
    add_block();

    const flexboxProps = [
      ["flex-direction", ["row", "row-reverse", "column", "column-reverse"]],
      ["flex-wrap", ["nowrap", "wrap", "wrap-reverse"]],
      [
        "justify-content",
        [
          "flex-start",
          "flex-end",
          "center",
          "space-between",
          "space-around",
          "space-evenly",
          "start",
          "end",
          "left",
          "right"
        ]
      ],
      [
        "align-items",
        [
          "stretch",
          "center",
          "flex-start",
          "flex-end",
          "baseline",
          "initial",
          "inherit"
        ]
      ],
      [
        "align-content",
        [
          "stretch",
          "center",
          "flex-start",
          "flex-end",
          "space-between",
          "space-around",
          "initial",
          "inherit"
        ]
      ]
    ];

    container.onmouseup = block_unclicked;

    container.onmousemove = event => {
      if (target) {
        let moved_handle = false;
        const el = event.target;
        if (current_drag_handle === "nw") {
          nw.style.left = event.clientX - 15 + "px";
          nw.style.top = event.clientY - 15 + "px";
          sw.style.left = event.clientX - 15 + "px";
          ne.style.top = event.clientY - 15 + "px";
          moved_handle = true;
        } else if (current_drag_handle === "ne") {
          ne.style.left = event.clientX - 15 + "px";
          ne.style.top = event.clientY - 15 + "px";
          se.style.left = event.clientX - 15 + "px";
          nw.style.top = event.clientY - 15 + "px";
          moved_handle = true;
        } else if (current_drag_handle === "se") {
          se.style.left = event.clientX - 15 + "px";
          se.style.top = event.clientY - 15 + "px";
          ne.style.left = event.clientX - 15 + "px";
          sw.style.top = event.clientY - 15 + "px";
          moved_handle = true;
        } else if (current_drag_handle === "sw") {
          sw.style.left = event.clientX - 15 + "px";
          sw.style.top = event.clientY - 15 + "px";
          nw.style.left = event.clientX - 15 + "px";
          se.style.top = event.clientY - 15 + "px";
          moved_handle = true;
        } else {
          target.style.left = target.offsetLeft + event.movementX + "px";
          target.style.top = target.offsetTop + event.movementY + "px";
        }

        if (moved_handle) {
          current_rect.style.left = nw.offsetLeft + 15 + "px";
          current_rect.style.top = nw.offsetTop + 15 + "px";
          current_rect.style.width = se.offsetLeft - nw.offsetLeft + "px";
          current_rect.style.height = se.offsetTop - nw.offsetTop + "px";
        } else {
          nw.style.left = current_rect.offsetLeft - 15 + "px";
          nw.style.top = current_rect.offsetTop - 15 + "px";
          ne.style.left =
            current_rect.offsetLeft + current_rect.offsetWidth - 15 + "px";
          ne.style.top = current_rect.offsetTop - 15 + "px";
          se.style.left =
            current_rect.offsetLeft + current_rect.offsetWidth - 15 + "px";
          se.style.top =
            current_rect.offsetTop + current_rect.offsetHeight - 15 + "px";
          sw.style.left = current_rect.offsetLeft - 15 + "px";
          sw.style.top =
            current_rect.offsetTop + current_rect.offsetHeight - 15 + "px";
        }
      }
    };

    const get_pos = (parentEl, el) => {
      return [
        el.offsetLeft - parentEl.offsetLeft,
        el.offsetTop - parentEl.offsetTop,
        el.offsetWidth,
        el.offsetHeight
      ];
    };

    const calc_distance = (p1, p2) => {
      return Math.sqrt(
        (p1[0] - p2[0]) * (p1[0] - p2[0]) +
          (p1[1] - p2[1]) * (p1[1] - p2[1]) +
          (p1[2] - p2[2]) * (p1[2] - p2[2]) +
          (p1[3] - p2[3]) * (p1[3] - p2[3])
      );
    };

    const flex_box = event => {
      const flex_container = document.getElementById("flex-container");
      const positions = [];
      for (let block of blocks) {
        positions.push(get_pos(container, block));
      }

      const indexes = [];
      let total = 1;
      for (let i = 0; i < 5; i++) {
        indexes[i] = 0;
        total *= flexboxProps[i][1].length;
      }

      let running = true;
      let rounds = 0;
      let best;
      let best_distance = 100000;
      do {
        for (let i = 0; i < 5; i++) {
          flex_container.style[flexboxProps[i][0]] =
            flexboxProps[i][1][indexes[i]];
        }

        const fpositions = [];

        for (let block of flexblocks) {
          fpositions.push(get_pos(flex_container, block));
        }

        let distance = 0;
        for (let i = 0; i < block_count; i++) {
          distance += calc_distance(fpositions[i], positions[i]);
        }

        if (distance < best_distance) {
          best = indexes.slice();
          best_distance = distance;
        }

        let current_index = 0;
        let adding_indexes = true;
        do {
          indexes[current_index]++;
          if (
            indexes[current_index] === flexboxProps[current_index][1].length
          ) {
            indexes[current_index] = 0;
            current_index++;
            if (current_index === flexboxProps.length) {
              running = false;
              adding_indexes = false;
            }
          } else {
            adding_indexes = false;
          }
        } while (adding_indexes);
        rounds++;
      } while (running);

      const css_props = document.getElementById("css-props");
      let css_prop_string = ".container {\n";

      for (let i = 0; i < 5; i++) {
        flex_container.style[flexboxProps[i][0]] = flexboxProps[i][1][best[i]];
        css_prop_string =
          css_prop_string +
          `    ${flexboxProps[i][0]}: ${flexboxProps[i][1][best[i]]};\n`;
      }

      css_prop_string = css_prop_string + "}\n\n";

      const flexItemProps = [
        { "flex-grow": 1, "flex-shrink": 0, "flex-basis": "auto" },
        { "flex-grow": 0, "flex-shrink": 1, "flex-basis": "auto" },
        { "flex-grow": 0, "flex-shrink": 0, "flex-basis": 0 }
      ];

      const flexItemPropStrings = [
        "flex: 1 0 auto;",
        "flex: 0 1 auto;",
        "flex: 0 0 0;"
      ];

      best_distance = 1000000;
      let best_item_props = 0;
      for (let rectI = 0; rectI < Math.pow(3, block_count); rectI++) {
        let index = rectI;
        for (let j = 0; j < block_count; j++) {
          Object.assign(flexblocks[j].style, flexItemProps[index % 3]);
          index = (index / 3) | 0;
        }

        const fpositions = [];
        for (let block of flexblocks) {
          fpositions.push(get_pos(flex_container, block));
        }

        let distance = 0;
        for (let i = 0; i < block_count; i++) {
          distance += calc_distance(fpositions[i], positions[i]);
        }

        if (distance < best_distance) {
          best_item_props = rectI;
          best_distance = distance;
        }
      }

      let index = best_item_props;
      for (let j = 0; j < block_count; j++) {
        Object.assign(flexblocks[j].style, flexItemProps[index % 3]);
        css_prop_string =
          css_prop_string +
          `.block${j + 1} { ${flexItemPropStrings[index % 3]} }\n`;
        index = (index / 3) | 0;
      }

      if (this.flexboxCssUpdate) {
        this.flexboxCssUpdate(css_prop_string);
      }
    };

    document.getElementById("flex-box-me").onclick = flex_box;
    document.getElementById("add-block").onclick = add_block;
  }
}

window.customElements.define("brute-force", BruteForce);
