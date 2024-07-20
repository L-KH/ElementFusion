type Config = {
    [key: number]: {
        nft: {
            address: `0x${string}`;
        };
    };
};

export const addresses: Config ={
    "5": {
        "nft": {
            "address": "0xcaa8aa6733cff9a916b931e34b2cb817193bfb19"
        }
    },
    "11155111": {
        "nft": {
            "address": "0xb99e5534d42500eb1d5820fba3bb8416ccb76396"
        }
    },
    "59140": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "534353": {
        "nft": {
            "address": "0x428898967a7fC5CD9B362236c0849DBf51add007"
        }
    },
    "57000": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "80085": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "1995": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "167008": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "64165": {
        "nft": {
            "address": "0x3B632ac4f6426C085C721FA0c371F90cEAcFaf72"
        }
    },
    "59901": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "34443": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "300": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "324": {
        "nft": {
            "address": "0xb99e5534d42500eb1d5820fba3bb8416ccb76396"
        }
    },
    "9659": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "9789": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "1687": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "48899": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "167009": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "690": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "161221135": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    },
    "80084": {
        "nft": {
            "address": "0xb99E5534d42500eB1d5820fBA3Bb8416cCB76396"
        }
    }
    
}


export const OPENAI_API_KEY = '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';
type IAPIURI = {
    [key: string]: string;
};
export const apiUrlMap: IAPIURI = { 
    'stable-diffusion-2-1': 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
    'stable-diffusion-v1-5': 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
    'stable-diffusion-v1-4': 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4',
    'openjourney':'https://api-inference.huggingface.co/models/prompthero/openjourney',
    'openjourney V4':'https://api-inference.huggingface.co/models/prompthero/openjourney-v4',
    'Realistic Vision':'https://api-inference.huggingface.co/models/SG161222/Realistic_Vision_V1.4',
    'anything-v5.0':'https://api-inference.huggingface.co/models/stablediffusionapi/anything-v5',
    'Dungeons-and-Diffusion':'https://api-inference.huggingface.co/models/0xJustin/Dungeons-and-Diffusion',
    'Pokemon Diffusers':'https://api-inference.huggingface.co/models/lambdalabs/sd-pokemon-diffusers',
    'EdenAI':'EdenAI',

    // 'DALLE': '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',
    // 'STABLE_DIFFUSION_MODEL_NAME':'https://stablediffusionapi.com/api/v3/text2img',
 };