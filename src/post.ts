import axios from 'axios'
import { config } from './config'

export async function post_to_target(url: string) {
    await axios.post(config.post_target_url, {
        data: {
            [config.post_field_name]: url,
        }
    });
}
