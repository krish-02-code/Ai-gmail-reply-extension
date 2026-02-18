console.log("Email writer Extension Loaded");

function findComposeToolbar() {
    return document.querySelector('.btC');
}

function createAiControlsWrapper() {
    const wrapper = document.createElement('div');

    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.height = '36px'; 
    wrapper.style.gap = '6px';
    wrapper.style.marginRight = '6px';

    return wrapper;
}



function createToneSelector() {
    const select = document.createElement('select');
    select.id = 'ai-tone-selector';

    select.style.height = '36px';
    select.style.padding = '0 10px';
    select.style.borderRadius = '18px';
    select.style.border = '1px solid #dadce0';
    select.style.background = '#fff';
    select.style.appearance = 'none'; 
    select.style.fontSize = '14px';
    select.style.fontFamily = 'Google Sans, Roboto, Arial, sans-serif';
    select.style.cursor = 'pointer';


    select.innerHTML = `
        <option value="professional">Professional</option>
        <option value="friendly">Friendly</option>
        <option value="short">Short</option>
        <option value="apologetic">Apologetic</option>
    `;

    return select;
}

function createAiButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.style.marginRight = '8px';
    button.innerText = 'AI Reply';
    button.setAttribute('role', 'button');
    return button;
}

function getEmailContent() {
    const content =
        document.querySelector('.a3s.aiL') ||
        document.querySelector('.gmail_quote');
    return content ? content.innerText.trim() : '';
}

function injectButton() {
    const toolbar = findComposeToolbar();
    if (!toolbar) return;

    if (toolbar.querySelector('.ai-reply-button')) return;

    const wrapper = createAiControlsWrapper();
    const toneSelector = createToneSelector();
    const button = createAiButton();

    wrapper.appendChild(toneSelector);
    wrapper.appendChild(button);

    toolbar.insertBefore(wrapper, toolbar.firstChild);

    button.addEventListener('click', async () => {
        try {
            button.innerText = "Generating...";
            button.style.pointerEvents = 'none';

            const emailContent = getEmailContent();
            const tone = document.getElementById('ai-tone-selector')?.value || 'professional';

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailContent, tone })
            });

            const reply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, reply);
            }
        } catch (e) {
            console.error("AI reply failed", e);
        } finally {
            button.innerText = 'AI Reply';
            button.style.pointerEvents = 'auto';
        }
    });
}

const observer = new MutationObserver(injectButton);
observer.observe(document.body, { childList: true, subtree: true });
