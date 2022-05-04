import ky from 'ky';


var template = ` <div class="products-row">
          <button class="cell-more-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-more-vertical">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          <div class="product-cell image">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60"
              alt="product">
            <span>FILENAME</span>
          </div>
          <div class="product-cell user"><span class="cell-label">User:</span>Malice#6773</div>
          <div class="product-cell filetype"><span class="cell-label">Type:</span>FILETYPE</div>
          <div class="product-cell status-cell">
            <span class="cell-label">Timestamp:</span>
            <span class="timestamp active">DATE</span>
          </div>
          <div class="product-cell filesize"><span class="cell-label">Size:</span>FILESIZE</div>
          <div class="product-cell emojiid"><span class="cell-label">Id:</span>EMOJIID</div>
        </div>`

// fetch("https://cdn.malice.ml/getfiles")

const json = await ky.post('https://example.com', {json: {foo: true}}).json();

console.log(json);