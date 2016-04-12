
using System.Collections.Generic;
using System.Linq;
using gab16search.ViewModels;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;

public interface ISearchService
{
    DocumentSearchResult Search(SearchPayload payload);
    DocumentSuggestResult Suggest(string term, bool fuzzy);
}

public class SearchService:ISearchService
{
    private SearchServiceClient client;
    
    public SearchService(string searchAccount, string searchKey){
        client = new SearchServiceClient(searchAccount, new SearchCredentials(searchKey));     
    }    
    
    public DocumentSuggestResult Suggest(string term, bool fuzzy){
        SuggestParameters sp = new SuggestParameters();
        sp.Top = 5;
        sp.UseFuzzyMatching=fuzzy;
        var indexClient = client.Indexes.GetClient("movies");
        return indexClient.Documents.Suggest(term, "suggester", sp);
    }
    
    public DocumentSearchResult Search(SearchPayload payload){
        var indexClient = client.Indexes.GetClient(payload.Index);
        var sp = new SearchParameters();
        sp.Top = payload.PageSize;
        sp.Skip = (payload.Page - 1) * payload.PageSize;
        if(payload.Filters!=null){
            sp.Filter = string.Join(" and ", payload.Filters.Select(x=> GetFilterExpression(x.Key, x.Value)).ToArray());
        }
        sp.OrderBy = payload.OrderBy.Split(',');
        sp.QueryType = "full".Equals(payload.QueryType)?QueryType.Full:QueryType.Simple;
        sp.SearchMode = payload.SearchMode;
        if(!payload.Index.Equals("movies")){
            sp.HighlightFields = new List<string>(){"text"};
        }
        if(!string.IsNullOrEmpty(payload.ScoringProfile)){
            sp.ScoringProfile = payload.ScoringProfile;
            if(!string.IsNullOrEmpty(payload.ScoringParameter)){
                sp.ScoringParameters = payload.ScoringParameter.Split(',').Select(x=> new ScoringParameter("likes", payload.ScoringParameter)).ToList();    
            }
            else{
                if(payload.ScoringParameter=="")
                sp.ScoringParameters = new List<ScoringParameter>(){ new ScoringParameter("likes", "none")};
            }    
        } 
        sp.IncludeTotalResultCount = true;
        if(payload.IncludeFacets){
            /* FACETS FOR APPLIED FILTERS ARE NOT REQUIRED */
            var appliedFilters = new List<string>();
            if(payload.Filters!=null){
                 appliedFilters = payload.Filters.Select(x=>x.Key).ToList();
            }
            if(payload.Index.Equals("movies")){
                sp.Facets = (new List<string>(){"year", "rtAllCriticsRating", "actorTags", "genreTags"}).Except(appliedFilters).ToList();
            }
            else{
                sp.Facets = (new List<string>(){"account", "hashtags"}).Except(appliedFilters).ToList();
            }
        }
        return indexClient.Documents.Search(payload.Text, sp);
    }
    
    private string GetFilterExpression(string key, string value){
        switch (key) {
            case "year":
            case "account":
            case "rtAllCriticsRating":
                 return string.Format("{0} eq {1}", key, value);
             
            case "actorTags":
            case "genreTags":
            case "hashtags":
                return string.Format("{0}/any(t: t eq '{1}') ", key, value);
        }
        return string.Empty;
    }     
}