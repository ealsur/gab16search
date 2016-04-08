using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;

public interface IStorageService
{
    void Enqueue(string message);
}

public class StorageService:IStorageService{
    private CloudQueue queue;
        public StorageService(string connstring){
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connstring);
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            queue = queueClient.GetQueueReference("twitter");
        }
        
        public void Enqueue(string message){
            queue.AddMessage(new CloudQueueMessage(message));
        }
    
}