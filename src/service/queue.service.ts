import QueueContructModel from '../model/queue-contruct.model';

class QueueService {
    private static instance: QueueService;
    queue = new Map();

    private constructor() {

    }

    public static getInstance(): QueueService {
        if (!QueueService.instance) {
            QueueService.instance = new QueueService();
        }

        return QueueService.instance;
    }

    get(id: any) {
        return this.queue.get(id);
    }

    set(id: any, queueContruct: QueueContructModel) {
        this.queue.set(id, queueContruct);
    }

    delete(id: any) {
        this.queue.delete(id);
    }

}

export default QueueService;
