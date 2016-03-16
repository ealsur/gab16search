
using System.Collections.Generic;
using System.Linq;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Newtonsoft.Json;

public interface ISearchService
{
    string Search(SearchPayload payload);
}

public class SearchService:ISearchService
{
    private SearchServiceClient client;
    private SearchIndexClient indexClient;
    public SearchService(string searchAccount, string searchKey){
        client = new SearchServiceClient(searchAccount, new SearchCredentials(searchKey));     
        indexClient = client.Indexes.GetClient("movies");   
    }    
    public string Search(SearchPayload payload){
        var sp = new SearchParameters();
        sp.Top = payload.PageSize;
        sp.Skip = (payload.Page - 1) * payload.PageSize;
        sp.Filter = string.Join(",", payload.Filters.Select(x=>string.Format("{0}={1}", x.Key, x.Value)).ToArray());
        sp.OrderBy = payload.OrderBy.Split(',');
        sp.QueryType = payload.QueryType;
        sp.SearchMode = payload.SearchMode;
        if(!string.IsNullOrEmpty(payload.ScoringProfile)){
            sp.ScoringProfile = payload.ScoringProfile;    
        }        
        sp.IncludeTotalResultCount = true;
        if(payload.IncludeFacets){
            sp.Facets = new List<string>(){"year", "rtAllCriticsRating", "actorTags", "genreTags"};
        }
        return JsonConvert.SerializeObject(indexClient.Documents.Search(payload.Text, sp));
    }     
}