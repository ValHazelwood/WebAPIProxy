namespace HDRezka.Types
{
    public class MovieRequest : MediaRequest
    {
        public int IsCamRip { get; set; }

        public int IsAds { get; set; }

        public int IsDirector { get; set; }
    }
}