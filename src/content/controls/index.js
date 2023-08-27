import config from "../../util/config";

export default function useControls(controls) {
    window.addEventListener("keydown", e => {
        const action = eventRouter(e);
        if (action) {
            controls[action]({
                selection: window.getSelection().toString(),
            });
        }
    });
}

function eventRouter(e) {
    for (let action in config.value.actions) {
        if (matchAction(e, config.value.actions[action])) {
            e.preventDefault();
            return action;
        }
    }
}

function matchAction(e, action) {
    for (let prop in action) {
        if (e[prop] !== action[prop])
            return false;
    }
    return true;
}
