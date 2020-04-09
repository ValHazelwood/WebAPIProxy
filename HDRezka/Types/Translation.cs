using HDRezka.Types;

namespace HDRezka
{
    public class Translation
    {
        public int? Id { get; set; }

        public string Name { get; set; }

        public Season[] Seasons { get; set; }

        public CDNStream[] CDNStreams { get; set; }
    }
}
