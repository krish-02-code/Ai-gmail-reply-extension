console.log("Email writer Extension Loaded");

function findComposeToolbar() {
    return document.querySelector('.gU.Up');
}

function createAiButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.style.marginRight = '8px';
    button.innerText = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function getEmailContent() {
    const content =
        document.querySelector('.a3s.aiL') ||
        document.querySelector('.gmail_quote');
    return content ? content.innerText.trim() : '';
}

function injectButton() {
    if (document.querySelector('.ai-reply-button')) return;

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    const button = createAiButton();

    button.addEventListener('click', async () => {
        try {
            button.innerText = "Generating...";
            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent,
                    tone: 'professional'
                })
            });

            const reply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, reply);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate reply");
        } finally {
            button.innerText = 'AI Reply';
        }
    });

    toolbar.prepend(button);
}

const observer = new MutationObserver(() => {
    injectButton();
});

observer.observe(document.body, { childList: true, subtree: true });
